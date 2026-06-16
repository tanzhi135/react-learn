// React 核心：useRef 引用 DOM/Cesium 实例，useState 管理组件状态，useCallback 缓存回调函数，useEffect 处理副作用
import React, { useRef, useState, useCallback, useEffect } from "react";
// Resium 组件：Viewer 地球容器，Entity 独立对象，CameraFlyTo 相机飞行
import { Viewer, Entity, CameraFlyTo } from "resium";
// Ant Design：Modal 弹窗，Button 按钮
import { Modal, Button } from "antd";
// Cesium 核心库：三维坐标、颜色、经纬度转换、数学工具、鼠标事件处理器、场景模式、多边形层级
import {
  Cartesian3,
  Color,
  Cartographic,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  SceneMode,
  PolygonHierarchy,
} from "cesium";
// 自定义组件：地图工具栏
import MapToolbar from "../components/MapToolbar";
// 工具函数：坐标转换、面积计算、面积格式化
import { toCartesian3Array, computeArea, formatArea } from "../utils/geo";
// 类型导入（满足 verbatimModuleSyntax 配置）
import type { ToolbarMode } from "../components/MapToolbar";
import type { LngLat } from "../utils/geo";

/** 已完成的多边形数据结构：包含顶点列表、面积值和格式化字符串 */
interface CompletedPolygon {
  points: LngLat[];
  area: number;
  formatted: string;
}

/**
 * 鼠标点击地球拾取经纬度的钩子函数
 * 创建 ScreenSpaceEventHandler，绑定左键点击事件从 globe 拾取坐标
 * 同时支持绑定右键点击回调
 *
 * @param viewerRef - Cesium Viewer 引用
 * @param eventHandlerRef - 事件处理器引用（用于外部销毁清理）
 * @param onPick - 左键点击拾取成功后的回调，传入经纬度（度）
 * @param onRightClick - 可选，右键点击回调
 */
function usePickHandler(
  viewerRef: React.MutableRefObject<any>,
  eventHandlerRef: React.MutableRefObject<ScreenSpaceEventHandler | null>,
  onPick: (lng: number, lat: number) => void,
  onRightClick?: () => void,
) {
  // 获取 Cesium Viewer 原生实例
  const viewer = viewerRef.current?.cesiumElement;
  if (!viewer) return;

  // 先销毁旧的处理器（防止多个处理器冲突）
  if (eventHandlerRef.current) {
    eventHandlerRef.current.destroy();
    eventHandlerRef.current = null;
  }

  // 创建新的鼠标事件处理器，绑定在 canvas 上
  const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
  eventHandlerRef.current = handler;

  // 左键点击：从屏幕坐标计算经纬度
  handler.setInputAction((movement: any) => {
    // movement.position 是鼠标点击的屏幕像素坐标
    const ray = viewer.camera.getPickRay(movement.position); // 从相机位置发出射线穿过鼠标点
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene); // 计算射线与地球的交点（三维坐标）
    if (!cartesian) return; // 点击到天空则忽略
    // 三维坐标 → 地理坐标（弧度）
    const carto = Cartographic.fromCartesian(cartesian);
    // 弧度转度
    const lng = CesiumMath.toDegrees(carto.longitude);
    const lat = CesiumMath.toDegrees(carto.latitude);
    onPick(lng, lat);
  }, ScreenSpaceEventType.LEFT_CLICK);

  // 右键点击（可选）：用于取消当前操作
  if (onRightClick) {
    handler.setInputAction(onRightClick, ScreenSpaceEventType.RIGHT_CLICK);
  }
}

/**
 * 主组件：3D 地图页面
 * 使用 Resium (Cesium) 展示三维地球，提供多种地图交互功能
 * 高度 calc(100vh - 64px) 减去顶部导航栏高度
 */
const MapPage: React.FC = () => {
  // 页面初始化时全局禁用右键菜单（浏览器默认菜单会干扰地图交互）
  // 页面销毁时自动取消监听，防止内存泄漏
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault();
    document.body.addEventListener("contextmenu", handler);
    return () => document.body.removeEventListener("contextmenu", handler);
  }, []);

  // Cesium Viewer 实例引用
  const viewerRef = useRef<any>(null);
  // 当前活跃的鼠标事件处理器引用
  const eventHandlerRef = useRef<ScreenSpaceEventHandler | null>(null);

  // 当前交互模式状态
  const [mode, setMode] = useState<ToolbarMode>("idle");

  // 点选经纬度相关状态
  const [coordModalVisible, setCoordModalVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{
    lng: string;
    lat: string;
  } | null>(null);

  // 标记点列表
  const [markers, setMarkers] = useState<LngLat[]>([]);

  // 面积测量相关状态
  const [areaPoints, setAreaPoints] = useState<LngLat[]>([]); // 正在绘制的顶点（用于实时渲染）
  const areaPointsRef = useRef<LngLat[]>([]); // 顶点引用副本（避免闭包捕获过时值）
  const [areaResultVisible, setAreaResultVisible] = useState(false); // 面积结果弹窗
  const [areaResult, setAreaResult] = useState<{
    area: number;
    formatted: string;
  } | null>(null);
  const [completedPolygons, setCompletedPolygons] = useState<
    CompletedPolygon[]
  >([]); // 已完成多边形列表
  const [is3DMode, setIs3DMode] = useState(true); // 2D/3D 模式标识

  /**
   * 清除所有交互模式：销毁事件处理器，将 mode 重置为 idle
   */
  const clearMode = useCallback(() => {
    if (eventHandlerRef.current) {
      eventHandlerRef.current.destroy(); // 销毁 Cesium 事件处理器
      eventHandlerRef.current = null;
    }
    setMode("idle");
  }, []);

  /** 快捷获取 Cesium Viewer 原生实例 */
  const getViewer = () => viewerRef.current?.cesiumElement;

  // ==================== 功能 1：点选经纬度 ====================
  const handleSelectPoint = useCallback(() => {
    clearMode();
    setSelectedCoords(null);
    setCoordModalVisible(false);

    // 使用拾取钩子，成功时显示经纬度弹窗
    usePickHandler(
      viewerRef,
      eventHandlerRef,
      (lng, lat) => {
        clearMode();
        setSelectedCoords({ lng: lng.toFixed(6), lat: lat.toFixed(6) });
        setCoordModalVisible(true);
      },
      () => clearMode(), // 右键取消
    );
    setMode("selecting");
  }, [clearMode]);

  /** 复制经纬度到系统剪贴板 */
  const handleCopy = async () => {
    if (!selectedCoords) {
      setCoordModalVisible(false);
      return;
    }
    const text = `经度: ${selectedCoords.lng}\n纬度: ${selectedCoords.lat}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      Modal.error({
        title: "复制失败",
        content: "复制失败，请手动复制经纬度。",
      });
    } finally {
      setCoordModalVisible(false);
      setSelectedCoords(null);
    }
  };

  // ==================== 功能 2：添加标记 ====================
  const handleToggleAddMarker = useCallback(() => {
    if (mode === "addingMarker") {
      clearMode();
      return;
    }
    clearMode();

    usePickHandler(
      viewerRef,
      eventHandlerRef,
      (lng, lat) =>
        setMarkers((prev) => [...prev, { longitude: lng, latitude: lat }]),
      () => clearMode(),
    );
    setMode("addingMarker");
  }, [mode, clearMode]);

  // ==================== 功能 3 & 7：清除标记 & 清除面积 ====================
  const handleClearMarkers = () => setMarkers([]);
  const handleClearPolygons = () => setCompletedPolygons([]);

  // ==================== 功能 4：飞往城市 ====================
  const handleFlyTo = useCallback((lng: number, lat: number) => {
    const viewer = getViewer();
    if (!viewer) return;
    // 使用 Cesium camera.flyTo API，平滑飞行
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(lng, lat, 15000), // 目标经纬度 + 高度 15km
      duration: 2, // 飞行时长 2 秒
    });
  }, []);

  // ==================== 功能 5：切换 2D/3D ====================
  const handleToggleMode = useCallback(() => {
    const viewer = getViewer();
    if (!viewer) return;
    // 在 SCENE3D（3D 球体）和 SCENE2D（2D 平面）之间切换
    if (viewer.scene.mode === SceneMode.SCENE3D) {
      viewer.scene.mode = SceneMode.SCENE2D;
      setIs3DMode(false);
    } else {
      viewer.scene.mode = SceneMode.SCENE3D;
      setIs3DMode(true);
    }
  }, []);

  // ==================== 功能 6：面积测量 ====================
  const handleToggleAreaMeasurement = useCallback(() => {
    // 如果已在测量模式，则退出
    if (mode === "measuringArea") {
      clearMode();
      setAreaPoints([]);
      areaPointsRef.current = [];
      return;
    }
    clearMode();
    setAreaPoints([]);
    areaPointsRef.current = [];
    setMode("measuringArea");

    const viewer = getViewer();
    if (!viewer) return;

    // 面积测量需要独立的处理器
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    eventHandlerRef.current = handler;

    // 左键：添加顶点
    handler.setInputAction((movement: any) => {
      const ray = viewer.camera.getPickRay(movement.position);
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (!cartesian) return;
      const carto = Cartographic.fromCartesian(cartesian);
      const pt = {
        longitude: CesiumMath.toDegrees(carto.longitude),
        latitude: CesiumMath.toDegrees(carto.latitude),
      };
      const next = [...areaPointsRef.current, pt]; // 基于当前快照追加
      areaPointsRef.current = next; // 更新引用（用于后续回调）
      setAreaPoints(next); // 更新 state（触发实时渲染）
    }, ScreenSpaceEventType.LEFT_CLICK);

    // 右键：完成测量
    handler.setInputAction(() => {
      const pts = areaPointsRef.current;
      if (pts.length >= 3) {
        const area = computeArea(pts); // 计算面积
        const formatted = formatArea(area); // 格式化显示
        setAreaResult({ area, formatted });
        setAreaResultVisible(true); // 弹出结果
        setCompletedPolygons((p) => [
          ...p,
          { points: [...pts], area, formatted },
        ]); // 保存到已完成列表
      } else if (pts.length > 0) {
        Modal.warning({
          title: "顶点不足",
          content: `至少需要 3 个顶点（当前 ${pts.length} 个）。`,
        });
      }
      clearMode();
      setAreaPoints([]);
      areaPointsRef.current = [];
    }, ScreenSpaceEventType.RIGHT_CLICK);
  }, [mode, clearMode]);

  return (
    // 满宽容器，高度 = 视口高度 - 64px（导航栏），相对定位供工具栏定位
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 64px)",
        position: "relative",
      }}
    >
      {/* 左上角浮动工具栏 */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 1000 }}>
        <MapToolbar
          mode={mode}
          markers={markers}
          completedPolygons={completedPolygons}
          is3DMode={is3DMode}
          onSelectPoint={handleSelectPoint}
          onToggleAddMarker={handleToggleAddMarker}
          onClearMarkers={handleClearMarkers}
          onToggleAreaMeasurement={handleToggleAreaMeasurement}
          onClearPolygons={handleClearPolygons}
          onFlyTo={handleFlyTo}
          onToggleMode={handleToggleMode}
        />

        {/* 经纬度结果弹窗 */}
        <Modal
          title="已选点经纬度"
          open={coordModalVisible}
          onOk={handleCopy}
          onCancel={() => {
            setCoordModalVisible(false);
            setSelectedCoords(null);
          }}
          okText="复制坐标"
          cancelText="关闭"
        >
          <div style={{ marginBottom: 12 }}>经度：{selectedCoords?.lng}</div>
          <div style={{ marginBottom: 16 }}>纬度：{selectedCoords?.lat}</div>
          <div style={{ color: "#666", fontSize: 12 }}>
            点击"复制坐标"后弹窗将关闭。
          </div>
        </Modal>

        {/* 面积测量结果弹窗 */}
        <Modal
          title="面积测量结果"
          open={areaResultVisible}
          onCancel={() => {
            setAreaResultVisible(false);
            setAreaResult(null);
          }}
          footer={
            <Button
              onClick={() => {
                setAreaResultVisible(false);
                setAreaResult(null);
              }}
            >
              关闭
            </Button>
          }
        >
          {areaResult && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{ fontSize: 36, fontWeight: "bold", color: "#1890ff" }}
              >
                {areaResult.formatted}
              </div>
              <div style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
                精确值：{areaResult.area.toFixed(4)} 平方米
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Cesium 3D 地球视图 */}
      <Viewer
        ref={viewerRef}
        full
        animation={false} // 隐藏动画控件（时间滑块）
        timeline={false} // 隐藏时间轴
        fullscreenButton={false} // 隐藏全屏按钮
        homeButton={false} // 隐藏 Home 按钮
        navigationHelpButton={false} // 隐藏导航帮助
        geocoder={false} // 隐藏搜索框
        infoBox={false} // 隐藏信息框
      >
        {/* 默认红色标记点 */}
        <Entity
          name="默认标记"
          position={Cartesian3.fromDegrees(112.8922298, 28.19061531, 100)}
          point={{ pixelSize: 14, color: Color.RED }}
        />

        {/* 用户添加的绿色标记点 */}
        {markers.map((m, i) => (
          <Entity
            key={`m-${i}`}
            name={`标记点 ${i + 1}`}
            position={Cartesian3.fromDegrees(m.longitude, m.latitude, 100)}
            point={{ pixelSize: 10, color: Color.GREEN }}
          />
        ))}

        {/* 正在绘制的面积多边形（蓝色半透明实时预览） */}
        {mode === "measuringArea" && areaPoints.length >= 2 && (
          <Entity
            polygon={{
              hierarchy: new PolygonHierarchy(toCartesian3Array(areaPoints)),
              material: Color.BLUE.withAlpha(0.15),
              outline: true,
              outlineColor: Color.BLUE.withAlpha(0.6),
              outlineWidth: 2,
            }}
          />
        )}

        {/* 面积测量中的顶点标记（蓝色圆点 + 序号） */}
        {mode === "measuringArea" &&
          areaPoints.map((p, i) => (
            <Entity
              key={`av-${i}`}
              position={Cartesian3.fromDegrees(p.longitude, p.latitude, 10)}
              point={{
                pixelSize: 8,
                color: Color.BLUE,
                outlineColor: Color.WHITE,
                outlineWidth: 2,
              }}
              label={{
                text: `${i + 1}`,
                font: "12px sans-serif",
                fillColor: Color.WHITE,
                backgroundColor: Color.BLACK.withAlpha(0.6),
                showBackground: true,
                pixelOffset: { x: 0, y: -20 } as any,
              }}
            />
          ))}

        {/* 已完成的面积多边形（橙色半透明，保留参考） */}
        {completedPolygons.map((p, i) => (
          <Entity
            key={`cp-${i}`}
            polygon={{
              hierarchy: new PolygonHierarchy(toCartesian3Array(p.points)),
              material: Color.ORANGE.withAlpha(0.25),
              outline: true,
              outlineColor: Color.ORANGE,
              outlineWidth: 2,
            }}
          />
        ))}

        {/* 初始相机位置：湖南长沙上空 18km */}
        <CameraFlyTo
          duration={2}
          destination={Cartesian3.fromDegrees(112.8922298, 28.19061531, 18000)}
        />
      </Viewer>
    </div>
  );
};

export default MapPage;