// 引入 react-router-dom 的路由组件：BrowserRouter（浏览器路由）、Routes（路由集合）、Route（单条路由）
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Ant Design 全局配置组件，用于统一设置主题等
import { ConfigProvider } from 'antd'
// Ant Design 全局样式重置
import 'antd/dist/reset.css'
// 应用自定义全局样式
import './App.css'

// 布局组件：顶部导航栏 + 内容区域
import AppLayout from './components/AppLayout'
// 首页页面：展示 ECharts 图表示例
import HomePage from './pages/HomePage'
// 地图页面：展示 Resium (Cesium) 3D 地图
import MapPage from './pages/MapPage'

/**
 * 应用根组件
 * 使用 BrowserRouter 包裹整个应用，通过嵌套路由实现：
 * - /          → HomePage  （首页 - ECharts 图表）
 * - /map       → MapPage   （3D 地图 - Resium）
 */
function App() {
  return (
    // ConfigProvider：Ant Design 的全局配置容器
    <ConfigProvider>
      {/* BrowserRouter：HTML5 History 路由模式 */}
      <BrowserRouter>
        {/* Routes：匹配当前 URL 并渲染对应路由 */}
        <Routes>
          {/* 父路由使用 AppLayout 布局组件，所有子路由内容通过 <Outlet /> 渲染 */}
          <Route element={<AppLayout />}>
            {/* 首页路由：路径 / */}
            <Route path="/" element={<HomePage />} />
            {/* 地图页路由：路径 /map */}
            <Route path="/map" element={<MapPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App