import TrafficFlow from './TrafficFlow';
import VehicleFlow from './VehicleFlow';
import TollStationFlow from './TollStationFlow';

const LeftPanel: React.FC = () => {
  return (
    <div className="visual_left">
      <TrafficFlow />
      <VehicleFlow />
      <TollStationFlow />
    </div>
  );
};

export default LeftPanel;