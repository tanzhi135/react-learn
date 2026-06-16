// 引入 React 核心
import React from 'react'
// Ant Design UI 组件：Button 按钮，Space 弹性间距容器
import { Button, Space } from 'antd'
// 工具类型：LngLat 经纬度点类型
import type { LngLat } from '../utils/geo'

/** 工具栏模式枚举：idle 空闲 / selecting 点选坐标 / addingMarker 添加标记 / measuringArea 面积测量 */
export type ToolbarMode = 'idle' | 'selecting' | 'addingMarker' | 'measuringArea'

/** 工具栏组件属性接口 */
interface MapToolbarProps {
  mode: ToolbarMode                // 当前交互模式
  markers: LngLat[]                // 已添加的标记点列表
  completedPolygons: unknown[]     // 已完成的多边形列表
  is3DMode: boolean                // 是否处于 3D 模式
  onSelectPoint: () => void                // 点选经纬度
  onToggleAddMarker: () => void            // 切换添加标记模式
  onClearMarkers: () => void               // 清除所有标记
  onToggleAreaMeasurement: () => void      // 切换面积测量模式
  onClearPolygons: () => void              // 清除所有面积多边形
  onFlyTo: (lng: number, lat: number) => void  // 飞往指定城市
  onToggleMode: () => void                 // 切换 2D/3D 场景
}

/**
 * 地图工具栏组件
 * 展示所有地图交互功能按钮，包括点选坐标、标记点、面积测量、飞行和场景切换
 */
const MapToolbar: React.FC<MapToolbarProps> = ({
  mode,
  markers,
  completedPolygons,
  is3DMode,
  onSelectPoint,
  onToggleAddMarker,
  onClearMarkers,
  onToggleAreaMeasurement,
  onClearPolygons,
  onFlyTo,
  onToggleMode,
}) => {
  // 判断当前是否处于某种交互模式（非空闲），用于控制提示信息的显示
  const isActiveMode = mode !== 'idle'

  return (
    // 垂直排列的容器，按钮间距 8px
    <Space direction="vertical" size={8}>
      {/* 水平按钮组，wrap 属性支持窗口缩小时自动换行 */}
      <Space wrap size={8}>
        {/* 功能 1：点选经纬度 — primary 蓝色主色调，click 时显示 loading 动画 */}
        <Button
          type="primary"
          onClick={onSelectPoint}
          loading={mode === 'selecting'}
        >
          {mode === 'selecting' ? '请点击地图...' : '点选经纬度'}
        </Button>

        {/* 功能 2：添加标记 — 激活时变为 primary + danger（红色高亮） */}
        <Button
          type={mode === 'addingMarker' ? 'primary' : 'default'}
          danger={mode === 'addingMarker'}
          onClick={onToggleAddMarker}
        >
          {mode === 'addingMarker' ? '取消标记' : '添加标记'}
        </Button>

        {/* 功能 3：清除标记 — 红色背景，无标记时 40% 透明度置灰 */}
        <Button
          onClick={onClearMarkers}
          disabled={markers.length === 0}
          style={{
            backgroundColor: '#ff4d4f',
            color: '#fff',
            borderColor: '#ff4d4f',
            opacity: markers.length === 0 ? 0.4 : 1,
          }}
        >
          清除标记 ({markers.length})
        </Button>

        {/* 功能 6：计算面积 — 激活时变为 primary + danger（红色高亮） */}
        <Button
          type={mode === 'measuringArea' ? 'primary' : 'default'}
          danger={mode === 'measuringArea'}
          onClick={onToggleAreaMeasurement}
        >
          {mode === 'measuringArea' ? '取消测量' : '计算面积'}
        </Button>

        {/* 功能 7：清除面积 — 橙色背景，无多边形时 40% 透明度置灰 */}
        <Button
          onClick={onClearPolygons}
          disabled={completedPolygons.length === 0}
          style={{
            backgroundColor: '#fa8c16',
            color: '#fff',
            borderColor: '#fa8c16',
            opacity: completedPolygons.length === 0 ? 0.4 : 1,
          }}
        >
          清除面积 ({completedPolygons.length})
        </Button>

        {/* 功能 4-1：飞往北京（天安门广场坐标：116.397428°E, 39.90923°N） */}
        <Button onClick={() => onFlyTo(116.397428, 39.90923)}>
          飞往北京
        </Button>

        {/* 功能 5：切换 2D/3D 场景模式 */}
        <Button onClick={onToggleMode}>
          {is3DMode ? '切换2D' : '切换3D'}
        </Button>
      </Space>

      {/* 交互模式提示信息 — 仅在点选/标记/面积测量模式下显示 */}
      {isActiveMode && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            color: '#fff',
            fontSize: 12,
            lineHeight: 1.4,
            maxWidth: 300,
          }}
        >
          {mode === 'selecting' && '请在地图上左键点击一个位置，完成后会显示该点经纬度。'}
          {mode === 'addingMarker' && '请在地图上左键点击添加绿色标记点，右键取消。'}
          {mode === 'measuringArea' && '左键点击添加顶点（至少3个），右键完成测量。'}
        </div>
      )}
    </Space>
  )
}

export default MapToolbar