import EventRadar from './EventRadar';
import TollRevenue from './TollRevenue';
import TollRanking from './TollRanking';

const RightPanel: React.FC = () => {
  return (
    <div className="visual_right">
      <EventRadar />
      <TollRevenue />
      <TollRanking />
    </div>
  );
};

export default RightPanel;