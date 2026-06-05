const TopStats: React.FC = () => {
  return (
    <div className="visual_conTop">
      <div className="visual_conTop_box visual_conTop1">
        <div>
          <h3>当前警情数(起)</h3>
          <p>67</p>
          <div className="conTop_smil">
            <a className="sz">日环比:<span>+3%</span></a>
            <a className="xd">周环比:<span>-2%</span></a>
          </div>
        </div>
      </div>
      <div className="visual_conTop_box visual_conTop2">
        <div>
          <h3>区域拥堵指数</h3>
          <p>1.4</p>
          <div className="conTop_smil">
            <a className="">缓行</a>
            <a className="">平均车速<span>120</span>KM/H</a>
          </div>
        </div>
      </div>
      <div className="visual_conTop_box visual_conTop1">
        <div>
          <h3>当前警情数(起)</h3>
          <p>99</p>
          <div className="conTop_smil">
            <a className="sz">日环比:<span>+3%</span></a>
            <a className="xd">周环比:<span>-2%</span></a>
          </div>
        </div>
      </div>
      <div className="visual_conTop_box visual_conTop2">
        <div>
          <h3>当前警情数(起)</h3>
          <p>7421</p>
          <div className="conTop_smil">
            <a className="null">null</a>
            <a className="xd">月环比:<span>-2%</span></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopStats;