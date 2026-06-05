import ReactECharts from 'echarts-for-react';
import { option1 } from '../../config/option1';

const TrafficFlow: React.FC = () => {
  return (
    <div className="visual_box">
      <div className="visual_title">
        <span>交通流量</span>
        <img src="/ksh33.png" alt="" />
      </div>
      <div className="visual_chart">
        <ReactECharts option={option1} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default TrafficFlow;