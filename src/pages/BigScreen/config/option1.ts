// 交通流量 - 柱状图+折线图
const symbol = ' ';

const chartData = {
  legendBar: ['高速公路', '城镇公路'],
  legendLine: ['环比', '同比'],
  xAxis: ['2014', '2015', '2016', '2017', '2018', '2019'],
  yAxis: [
    [8, 10, 10, 11, 4, 13],
    [10, 7, 8, 8, 7, 9],
  ],
  lines: [
    [10, 10, 9, 11, 7, 4],
    [6, 12, 12, 2, 4, 4],
  ],
  barColor: ['#009883', '#e66922'],
  lineColor: ['#fd6665', '#fba73b'],
};

function buildOption() {
  const yAxis = chartData.yAxis || [];
  const lines = chartData.lines || [];
  const legendBar = chartData.legendBar || [];
  const legendLine = chartData.legendLine || [];
  const seriesArr: any[] = [];
  const legendArr: any[] = [];

  yAxis.forEach((item: number[], index: number) => {
    legendArr.push({ name: legendBar[index] });
    seriesArr.push({
      name: legendBar[index],
      type: 'bar',
      barGap: '0.5px',
      data: item,
      barWidth: 12,
      label: {
        normal: {
          show: false,
          formatter: '{c}' + symbol,
          position: 'top',
          textStyle: {
            color: '#000',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            textAlign: 'left',
            fontSize: 11,
          },
        },
      },
      itemStyle: {
        normal: {
          barBorderRadius: 0,
          borderWidth: 1,
          borderColor: '#ddd',
          color: chartData.barColor[index],
        },
      },
    });
  });

  lines.forEach((item: number[], index: number) => {
    legendArr.push({ name: legendLine[index] });
    seriesArr.push({
      name: legendLine[index],
      type: 'line',
      data: item,
      itemStyle: {
        normal: {
          color: chartData.lineColor[index],
          lineStyle: { width: 2, type: 'solid' },
        },
      },
      label: {
        normal: { show: false, position: 'top' },
      },
      symbol: 'circle',
      symbolSize: 5,
    });
  });

  return { seriesArr, legendArr };
}

const myData = buildOption();

export const option1 = {
  tooltip: {
    trigger: 'axis',
    formatter: function (params: any[]) {
      let time = '';
      let str = '';
      for (const i of params) {
        time = i.name.replace(/\n/g, '') + '<br/>';
        if (i.data === 'null' || i.data === null) {
          str += i.seriesName + '：无数据' + '<br/>';
        } else {
          str += i.seriesName + '：' + i.data + symbol + '%<br/>';
        }
      }
      return time + str;
    },
    axisPointer: { type: 'none' },
  },
  legend: {
    right: 10,
    top: 0,
    itemGap: 16,
    itemWidth: 10,
    itemHeight: 10,
    data: myData.legendArr,
    textStyle: {
      color: '#fff',
      fontStyle: 'normal',
      fontFamily: '微软雅黑',
      fontSize: 12,
    },
  },
  grid: { x: 0, y: 30, x2: 0, y2: 25 },
  xAxis: {
    type: 'category' as const,
    data: chartData.xAxis,
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: {
      show: true,
      interval: '0',
      textStyle: {
        lineHeight: 5,
        padding: [2, 2, 0, 2],
        height: 50,
        fontSize: 12,
        color: '#fff',
      },
      rich: {
        Sunny: { height: 50, padding: [0, 5, 0, 5], align: 'center' },
      },
      formatter: function (params: string) {
        let newParamsName = '';
        const provideNumber = 5;
        const paramsNameNumber = params?.length;
        if (paramsNameNumber && paramsNameNumber > provideNumber) {
          const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          for (let p = 0; p < rowNumber; p++) {
            const start = p * provideNumber;
            const end = start + provideNumber;
            if (p === rowNumber - 1) {
              newParamsName += params.substring(start, paramsNameNumber);
            } else {
              newParamsName += params.substring(start, end) + '\n';
            }
          }
        } else {
          newParamsName = params;
        }
        return '{Sunny|' + newParamsName + '}';
      },
      color: '#687284',
    },
  },
  yAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: {
      show: true,
      lineStyle: { color: '#F1F3F5', type: 'solid' },
      interval: 2,
    },
    splitNumber: 4,
  },
  series: myData.seriesArr,
};