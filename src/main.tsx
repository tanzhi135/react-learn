// React 严格模式组件，用于开发环境检测潜在问题
import { StrictMode } from 'react'
// React 18 的 createRoot API，用于替代旧的 ReactDOM.render
import { createRoot } from 'react-dom/client'
// 全局样式文件
import './index.css'
// Cesium 默认 Widget 样式（必须导入，否则 Viewer 无法正常渲染）
import 'cesium/Build/Cesium/Widgets/widgets.css'
// 根组件 App
import App from './App.tsx'

// 获取 root DOM 节点并使用 createRoot 创建 React 根
createRoot(document.getElementById('root')!).render(
  // 严格模式包裹，启用开发阶段的额外检查（仅在开发环境生效）
  <StrictMode>
    {/* 渲染应用根组件 */}
    <App />
  </StrictMode>,
)