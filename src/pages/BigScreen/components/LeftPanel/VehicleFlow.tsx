import ReactECharts from 'echarts-for-react';
import { option2 } from '../../config/option2';

const VehicleFlow: React.FC = () => {
  return (
    <div className="visual_box">
      <div className="visual_title">
        <span>交通工具流量</span>
        <img src="/ksh33.png" alt="" />
      </div>
      <div className="visual_chart">
        <ReactECharts option={option2} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};

export default VehicleFlow;