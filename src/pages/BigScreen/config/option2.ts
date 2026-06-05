// 交通工具流量 - 折线面积图
export const option2 = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: { color: '#fff' },
    },
  },
  legend: {
    icon: 'rect',
    itemWidth: 14,
    itemHeight: 5,
    itemGap: 13,
    data: ['小型车', '中型车', '大型车'],
    right: '10px',
    top: '0px',
    textStyle: { fontSize: 12, color: '#fff' },
  },
  grid: { x: 35, y: 25, x2: 8, y2: 25 },
  xAxis: [
    {
      type: 'category' as const,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#57617B' } },
      axisLabel: { textStyle: { color: '#fff' } },
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    },
  ],
  yAxis: [
    {
      type: 'value' as const,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#57617B' } },
      axisLabel: { margin: 10, textStyle: { color: '#fff' } },
      splitLine: { lineStyle: { color: '#57617B' } },
    },
  ],
  series: [
    {
      name: '小型车',
      type: 'line',
      smooth: true,
      lineStyle: { normal: { width: 2 } },
      areaStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(137, 189, 27, 0.3)' },
              { offset: 0.8, color: 'rgba(137, 189, 27, 0)' },
            ],
          },
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10,
        },
      },
      itemStyle: { normal: { color: 'rgb(137,189,27)' } },
      data: [20, 35, 34, 45, 52, 41, 49, 64, 24, 52.4, 24, 33],
    },
    {
      name: '中型车',
      type: 'line',
      smooth: true,
      lineStyle: { normal: { width: 2 } },
      areaStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 136, 212, 0.3)' },
              { offset: 0.8, color: 'rgba(0, 136, 212, 0)' },
            ],
          },
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10,
        },
      },
      itemStyle: { normal: { color: 'rgb(0,136,212)' } },
      data: [97.3, 99.2, 99.3, 100.0, 99.6, 90.6, 80.0, 91.5, 69.8, 67.5, 90.4, 84.9],
    },
    {
      name: '大型车',
      type: 'line',
      smooth: true,
      lineStyle: { normal: { width: 2 } },
      areaStyle: {
        normal: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(219, 50, 51, 0.3)' },
              { offset: 0.8, color: 'rgba(219, 50, 51, 0)' },
            ],
          },
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10,
        },
      },
      itemStyle: { normal: { color: 'rgb(219,50,51)' } },
      data: [84.2, 81.0, 67.5, 62.1, 43.7, 68.5, 51.9, 71.8, 76.7, 67.6, 62.9, 0],
    },
  ],
};