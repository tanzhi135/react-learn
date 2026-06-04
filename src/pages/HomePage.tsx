// 引入 React 核心类型
import React from 'react'
// Ant Design 卡片组件 Card，栅格布局 Row/Col，排版组件 Typography
import { Card, Row, Col, Typography } from 'antd'
// ECharts React 封装组件，通过 option 属性传入图表配置即可渲染
import ReactECharts from 'echarts-for-react'

// 从 Typography 中解构 Title 标题组件
const { Title } = Typography

// ==================== 折线图配置 ====================
// 类型：折线图 + 面积图
// 用途：展示月销售额的连续变化趋势
const lineOption = {
  title: { text: '折线图 - 月销售趋势' },
  tooltip: { trigger: 'axis' as const },           // 鼠标悬浮时显示坐标轴提示
  xAxis: {
    type: 'category' as const,                      // 类目轴（离散数据）
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  },
  yAxis: { type: 'value' as const },                // 数值轴
  series: [
    {
      name: '销售额',
      type: 'line',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      smooth: true,                                 // 平滑曲线
      lineStyle: { width: 3 },
      areaStyle: { opacity: 0.15 },                 // 面积填充，半透明
    },
  ],
}

// ==================== 柱状图配置 ====================
// 类型：分组柱状图
// 用途：对比不同产品两个季度的销量
const barOption = {
  title: { text: '柱状图 - 各产品季度销量' },
  tooltip: { trigger: 'axis' as const },
  xAxis: {
    type: 'category' as const,
    data: ['产品A', '产品B', '产品C', '产品D', '产品E'],
  },
  yAxis: { type: 'value' as const },
  series: [
    { name: 'Q1', type: 'bar', data: [120, 200, 150, 80, 70] },
    { name: 'Q2', type: 'bar', data: [180, 150, 230, 120, 90] },
  ],
  legend: { data: ['Q1', 'Q2'] },                  // 图例说明
}

// ==================== 饼图配置 ====================
// 类型：环形饼图（通过 radius 设置内径实现）
// 用途：展示各渠道的市场份额占比
const pieOption = {
  title: { text: '饼图 - 市场份额占比' },
  tooltip: { trigger: 'item' as const },            // 鼠标悬浮时显示单项详情
  series: [
    {
      name: '市场份额',
      type: 'pie',
      radius: ['40%', '70%'],                       // [内径, 外径]，实现环形效果
      center: ['50%', '55%'],                        // 图表居中位置
      data: [
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,                            // 高亮时阴影模糊
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}

// ==================== 散点图配置 ====================
// 类型：散点图
// 用途：展示身高与体重的分布关系
const scatterOption = {
  title: { text: '散点图 - 身高体重分布' },
  tooltip: { trigger: 'item' as const },
  xAxis: { type: 'value' as const, name: '身高(cm)' },
  yAxis: { type: 'value' as const, name: '体重(kg)' },
  series: [
    {
      type: 'scatter',
      // 数据格式：[身高, 体重]
      data: [
        [165, 58], [172, 68], [180, 75], [158, 50],
        [176, 72], [168, 62], [183, 80], [170, 65],
        [162, 55], [175, 70], [178, 78], [160, 52],
      ],
      symbolSize: 10,                                // 散点大小
    },
  ],
}

// ==================== 雷达图配置 ====================
// 类型：雷达图
// 用途：多维度能力对比（当前员工 vs 平均水准）
const radarOption = {
  title: { text: '雷达图 - 综合能力评估' },
  legend: { data: ['当前员工', '平均水准'] },
  radar: {
    // 定义各维度的名称和最大值
    indicator: [
      { name: '技术能力', max: 100 },
      { name: '沟通能力', max: 100 },
      { name: '管理能力', max: 100 },
      { name: '创新能力', max: 100 },
      { name: '协作能力', max: 100 },
    ],
  },
  series: [
    {
      type: 'radar',
      data: [
        { value: [90, 80, 70, 85, 75], name: '当前员工' },
        { value: [70, 70, 65, 60, 68], name: '平均水准' },
      ],
    },
  ],
}

/**
 * 首页组件
 * 使用栅格布局展示多个 ECharts 图表示例：
 * - 2 列布局（大屏 lg=12 即 50% 宽度，小屏 xs=24 即全宽）
 * - 每个图表用 Card 卡片包裹
 * - 雷达图占据整行
 */
const HomePage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      {/* 页面主标题 */}
      <Title level={2} style={{ marginBottom: 24 }}>
        ECharts 示例展示
      </Title>
      {/* Row：栅格行，gutter 设置列间距 [水平, 垂直] */}
      <Row gutter={[24, 24]}>
        {/* Col：栅格列，xs 小屏占 24（全宽），lg 大屏占 12（一半） */}
        <Col xs={24} lg={12}>
          <Card>
            {/* ReactECharts：ECharts 的 React 封装组件，传入 option 配置和 style 高度 */}
            <ReactECharts option={lineOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={barOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={pieOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={scatterOption} style={{ height: 350 }} />
          </Card>
        </Col>
        {/* 雷达图单独占一行（lg=24 全宽） */}
        <Col xs={24} lg={24}>
          <Card>
            <ReactECharts option={radarOption} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default HomePage