// 今日实时收费 - 3个环形图
function createGaugeOption(title: string, value: number, borderColors: string[], fillColors: string[]) {
  return {
    title: {
      text: title,
      subtext: '',
      left: 'center',
      top: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'PingFangSC-Regular',
      },
      subtextStyle: { color: '#fff', fontSize: 14 },
      itemGap: -1,
    },
    series: [
      {
        name: 'pie1',
        type: 'pie',
        clockWise: true,
        radius: ['65%', '70%'],
        itemStyle: {
          normal: {
            label: { show: false },
            labelLine: { show: false },
          },
        },
        hoverAnimation: false,
        data: [
          {
            value: value,
            name: 'completed',
            itemStyle: {
              normal: {
                borderWidth: 8,
                borderColor: {
                  colorStops: [
                    { offset: 0, color: borderColors[0] },
                    { offset: 1, color: borderColors[1] },
                  ],
                },
                color: {
                  colorStops: [
                    { offset: 0, color: fillColors[0] },
                    { offset: 1, color: fillColors[1] },
                  ],
                },
                label: { show: false },
                labelLine: { show: false },
              },
            },
          },
          {
            name: 'gap',
            value: 100 - value,
            itemStyle: {
              normal: {
                label: { show: false },
                labelLine: { show: false },
                color: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 0,
              },
            },
          },
        ],
      },
    ],
  };
}

export const option5 = createGaugeOption(
  '车辆总数',
  80,
  ['#1d54f7', '#68eaf9'],
  ['#1d54f7', '#68eaf9']
);

export const option6 = createGaugeOption(
  '今日上线',
  85,
  ['#02df94', '#28d3d0'],
  ['#02df94', '#28d3d0']
);

export const option7 = createGaugeOption(
  '今日报警',
  46,
  ['#eb3600', '#d0a00e'],
  ['#eb3600', '#d0a00e']
);