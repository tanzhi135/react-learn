// 引入 React 核心类型
import React from 'react'
// Ant Design 布局组件：Layout 整体布局，Menu 导航菜单
import { Layout, Menu } from 'antd'
// React Router 钩子：useNavigate 编程式导航，useLocation 获取当前路径，Outlet 子路由出口
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
// Ant Design 图标
import { HomeOutlined, GlobalOutlined } from '@ant-design/icons'

// 从 Layout 中解构出 Header（头部导航栏）和 Content（内容区）
const { Header, Content } = Layout

/**
 * 顶部导航栏菜单项配置
 * key: 路由路径，用于导航和选中态高亮
 * label: 显示文本
 * icon: 菜单图标
 * 后续扩展：在此数组中追加新对象即可添加新页面
 */
const menuItems = [
  {
    key: '/',
    label: '首页',
    icon: <HomeOutlined />,
  },
  {
    key: '/map',
    label: '3D地图',
    icon: <GlobalOutlined />,
  },
  // 后续可扩展：{ key: '/new-page', label: '新页面', icon: <AppstoreOutlined /> }
]

/**
 * 应用布局组件
 * 提供：固定顶部的深色导航栏 + 可滚动内容区域
 * 子页面通过 <Outlet /> 渲染
 */
const AppLayout: React.FC = () => {
  // useNavigate：返回导航函数，用于点击菜单时跳转
  const navigate = useNavigate()
  // useLocation：返回当前路由信息，用于菜单高亮
  const location = useLocation()

  /**
   * 菜单点击处理函数
   * @param e - 菜单事件对象，e.key 为被点击菜单项的 key（即路由路径）
   */
  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key)
  }

  return (
    // Layout：Ant Design 布局容器，最小高度撑满视口
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header：固定在顶部的导航栏 */}
      <Header
        style={{
          display: 'flex',         // flex 布局使 logo 和菜单水平排列
          alignItems: 'center',    // 垂直居中
          position: 'sticky',      // 粘性定位，滚动时固定在顶部
          top: 0,
          zIndex: 100,             // 确保导航栏在其他内容之上
        }}
      >
        {/* 左侧 Logo / 项目名称 */}
        <div
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 600,
            marginRight: 40,
            whiteSpace: 'nowrap',  // 防止文本换行
          }}
        >
          React Learn
        </div>
        {/* 水平导航菜单 */}
        <Menu
          theme="dark"              // 深色主题
          mode="horizontal"         // 水平模式
          selectedKeys={[location.pathname]}  // 根据当前路径高亮对应菜单项
          items={menuItems}         // 菜单项配置
          onClick={handleMenuClick} // 点击跳转
          style={{ flex: 1, minWidth: 0 }}  // flex:1 撑满剩余空间
        />
      </Header>
      {/* Content：页面内容区域，子路由通过 Outlet 渲染 */}
      <Content style={{ padding: 0 }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default AppLayout