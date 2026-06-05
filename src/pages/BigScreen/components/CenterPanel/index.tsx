import TopStats from './TopStats';
import ChinaMap from './ChinaMap';
import RealtimeToll from './RealtimeToll';

const CenterPanel: React.FC = () => {
  return (
    <div className="visual_con">
      <TopStats />
      <ChinaMap />
      <RealtimeToll />
    </div>
  );
};

export default CenterPanel;