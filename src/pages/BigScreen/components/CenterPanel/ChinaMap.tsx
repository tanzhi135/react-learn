import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { getChinaMapOption } from '../../config/option8';
import china from '../../../../../public/china.json'; // Ensure this path is correct based on your project structure
const ChinaMap: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null); 
  // @ts-ignore
  echarts.registerMap('china', {geoJSON: china});
  useEffect(() => {
    // Load china map script dynamically
    const script = document.createElement('script');
    script.src = '/china.js';
    script.async = true;
    script.onload = () => {
      // After china map is registered, initialize chart
      if (chartRef.current) {
        chartInstance.current = echarts.init(chartRef.current);
        chartInstance.current.setOption(
          getChinaMapOption([
            { offset: 0, color: '#58B3CC' },
            { offset: 1, color: '#F58158' },
          ])
        );
      }
    };
    script.onerror = () => {
      // Fallback if china.js not found
      if (chartRef.current) {
        chartInstance.current = echarts.init(chartRef.current);
        chartInstance.current.setOption({
          title: {
            text: '地图数据未加载',
            left: 'center',
            top: 'center',
            textStyle: { color: '#fff', fontSize: 16 },
          },
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      chartInstance.current?.dispose();
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="visual_conBot">
      <img className="visual_conBot_l" src="/ksh42.png" alt="" />
      <img className="visual_conBot_2" src="/ksh43.png" alt="" />
      <img className="visual_conBot_3" src="/ksh44.png" alt="" />
      <img className="visual_conBot_4" src="/ksh45.png" alt="" />
      <div className="visual_chart_text">
        <h1>出行服务+大数据</h1>
        <h2>东海省交通大数据分析平台</h2>
      </div>
      <div className="visual_chart" ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default ChinaMap;