import { useState, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import './BigScreen.css';

const BigScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading animation from original
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ksh">
      {loading && (
        <div id="load">
          <div className="load_img">
            <img className="jzxz1" src="/jzxz1.png" alt="" />
            <img className="jzxz2" src="/jzxz2.png" alt="" />
          </div>
        </div>
      )}
      <div className="head_top">
        <img className="img-responsive" src="/jcdsj_logo.gif" alt="Logo" />
      </div>
      <div className="visual">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
        <div className="clear"></div>
      </div>
    </div>
  );
};

export default BigScreen;