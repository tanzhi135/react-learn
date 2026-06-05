import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { option5, option6, option7 } from '../../config/option5_6_7';

const stations = ['全省数据', '大同北', '大同南', '朔州', '吕梁北', '吕梁南', '太原', '晋中', '太旧', '长治'];

const RealtimeToll: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(7); // 晋中 is active by default

  return (
    <div className="visual_conBot_bot">
      <div className="visualSssf_left">
        <h3>今日实时收费</h3>
        {stations.map((name, index) => (
          <a
            key={index}
            className={activeIndex === index ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
          >
            {name}
          </a>
        ))}
      </div>
      <div className="visualSssf_right">
        <div className="visualSssf_right_box">
          <ReactECharts option={option5} style={{ height: '100%', width: '100%' }} />
        </div>
        <div className="visualSssf_right_box">
          <ReactECharts option={option6} style={{ height: '100%', width: '100%' }} />
        </div>
        <div className="visualSssf_right_box">
          <ReactECharts option={option7} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  );
};

export default RealtimeToll;