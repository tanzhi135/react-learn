// 本月发生事件 - 雷达图
const color = ['#e9df3d', '#f79c19', '#21fcd6', '#08c8ff', '#df4131'];
const data = [
  { name: '超速', value: 30 },
  { name: '闯红灯', value: 30 },
  { name: '闯禁行', value: 42 },
  { name: '违停', value: 50 },
  { name: '逆行', value: 34 },
];

let max = data[0].value;
data.forEach(function (d) {
  max = d.value > max ? d.value : max;
});

const renderData: any[] = [
  {
    value: [],
    name: '告警类型TOP5',
    symbol: 'none',
    lineStyle: { normal: { color: '#ecc03e', width: 2 } },
    areaStyle: {
      normal: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: 'rgba(203, 158, 24, 0.8)' },
            { offset: 1, color: 'rgba(190, 96, 20, 0.8)' },
          ],
        },
      },
    },
  },
];

data.forEach(function (d, i) {
  const value = ['', '', '', '', ''];
  value[i] = String(max);
  renderData[0].value[i] = d.value;
  renderData.push({
    value: value,
    symbol: 'circle',
    symbolSize: 12,
    lineStyle: { normal: { color: 'transparent' } },
    itemStyle: { normal: { color: color[i] } },
  });
});

const indicator: any[] = [];
data.forEach(function (d) {
  indicator.push({ name: d.name, max: max, color: '#fff' });
});

export const option3 = {
  tooltip: { show: true, trigger: 'item' },
  radar: {
    center: ['50%', '50%'],
    radius: '80%',
    startAngle: 40,
    splitNumber: 4,
    shape: 'circle',
    splitArea: { areaStyle: { color: 'transparent' } },
    axisLabel: { show: false },
    axisLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.5)' } },
    splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.5)' } },
    indicator: indicator,
  },
  series: [{ type: 'radar', data: renderData }],
};

export const getOption31 = () => {
  const data31 = [
    { name: '超速', value: 15 },
    { name: '闯红灯', value: 14 },
    { name: '闯禁行', value: 23 },
    { name: '违停', value: 2 },
    { name: '逆行', value: 50 },
  ];
  let max31 = data31[0].value;
  data31.forEach(function (d) { max31 = d.value > max31 ? d.value : max31; });

  const renderData31: any[] = [
    {
      value: [],
      name: '告警类型TOP5',
      symbol: 'none',
      lineStyle: { normal: { color: '#ecc03e', width: 2 } },
      areaStyle: {
        normal: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(203, 158, 24, 0.8)' },
              { offset: 1, color: 'rgba(190, 96, 20, 0.8)' },
            ],
          },
        },
      },
    },
  ];
  data31.forEach(function (d, i) {
    const value = ['', '', '', '', ''];
    value[i] = String(max31);
    renderData31[0].value[i] = d.value;
    renderData31.push({
      value: value,
      symbol: 'circle',
      symbolSize: 12,
      lineStyle: { normal: { color: 'transparent' } },
      itemStyle: { normal: { color: color[i] } },
    });
  });
  const indicator31: any[] = [];
  data31.forEach(function (d) { indicator31.push({ name: d.name, max: max31, color: '#fff' }); });

  return {
    tooltip: { show: true, trigger: 'item' },
    radar: {
      center: ['50%', '50%'], radius: '80%', startAngle: 40,
      splitNumber: 4, shape: 'circle',
      splitArea: { areaStyle: { color: 'transparent' } },
      axisLabel: { show: false },
      axisLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.5)' } },
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.5)' } },
      indicator: indicator31,
    },
    series: [{ type: 'radar', data: renderData31 }],
  };
};