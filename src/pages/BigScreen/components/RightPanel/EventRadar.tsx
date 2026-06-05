import { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { option3, getOption31 } from '../../config/option3';

const EventRadar: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSlideIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="visual_box">
      <div className="visual_title">
        <span>本月发生事件</span>
        <img src="/ksh33.png" alt="" />
      </div>
      <div className="visual_chart">
        {slideIndex === 0 ? (
          <ReactECharts option={option3} style={{ height: '100%', width: '100%' }} />
        ) : (
          <ReactECharts option={getOption31()} style={{ height: '100%', width: '100%' }} />
        )}
      </div>
    </div>
  );
};

export default EventRadar;