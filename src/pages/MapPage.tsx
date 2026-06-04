// 引入 React 核心类型
import React from 'react'
// Resium：Cesium 的 React 封装组件
// Viewer：3D 地球视图容器
// Entity：在地球上添加独立对象（标记、图形等）
// CameraFlyTo：相机飞到指定位置的动画组件
import { Viewer, Entity, CameraFlyTo } from 'resium'
// Cesium 核心库：Cartesian3 三维坐标工具，Color 颜色工具
import { Cartesian3, Color } from 'cesium'

/**
 * 3D 地图页面组件
 * 使用 Resium (Cesium) 展示三维地球
 * 高度设置为 calc(100vh - 64px) 以减去顶部导航栏高度
 */
const MapPage: React.FC = () => {
  return (
    // 外层容器：宽度 100%，高度扣除顶部导航栏 64px
    <div style={{ width: '100%', height: 'calc(100vh - 64px)',position: 'relative' }}>
      {/* Viewer：Cesium 3D 地球主视图，full 属性使其填满容器，同时隐藏默认 UI 控件 */}
      <Viewer full
        animation={false}            // 隐藏动画控件
        timeline={false}             // 隐藏时间轴
        fullscreenButton={false}     // 隐藏全屏按钮
        homeButton={false}           // 隐藏 Home 按钮
        sceneModePicker={false}      // 隐藏场景模式选择器
        baseLayerPicker={false}      // 隐藏底图选择器
        navigationHelpButton={false} // 隐藏导航帮助按钮
        geocoder={false}             // 隐藏搜索框
        infoBox={false}              // 隐藏信息框
        selectionIndicator={false}   // 隐藏选择指示器
      >
        {/* Entity：在地球上添加一个标记点 */}
        <Entity
          name="北京标记"                                           // 标记名称，鼠标悬浮时显示
          position={Cartesian3.fromDegrees(116.39, 39.9, 200000)}  // 经纬度坐标（经度, 纬度, 高度）
          point={{ pixelSize: 14, color: Color.RED }}              // 点标记样式：大小 14px，红色
        />
        {/* CameraFlyTo：页面加载后相机自动飞到指定位置 */}
        <CameraFlyTo
          duration={3}                                              // 飞行动画时长（秒）
          destination={Cartesian3.fromDegrees(116.39, 39.9, 1500000)} // 目标位置：北京上方 1500km
        />
      </Viewer>
    </div>
  )
}

export default MapPage