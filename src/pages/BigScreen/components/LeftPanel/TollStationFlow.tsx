const TollStationFlow: React.FC = () => {
  return (
    <div className="visual_box toll_station_flow">
      <div className="visual_title">
        <span>收费站车流量</span>
        <img src="/ksh33.png" alt="" />
      </div>
      <div className="visual_chart sfzcll">
        <a>运输方式</a>
        <a>客运量</a>
        <a>货运量</a>
      </div>
      
        <div className="sfzcll_pos_box">
          {[0, 1, 2].map((index) => (
            <div className="sfzcll_box" key={index}>
              <img className="sfzcll_bkJk" src="/ksh34.png" alt="" />
              <img className="sfzcll_bkJk" src="/ksh34.png" alt="" />
              <img className="sfzcll_bkJk" src="/ksh34.png" alt="" />
              <img className="sfzcll_bkJk" src="/ksh34.png" alt="" />
              <label>
                <img src="/ksh35.png" alt="" />
                公路运输
              </label>
              <div className="sfzcll_smallBk">
                <div className="ygl">
                  <span>4347.2万</span>人
                </div>
              </div>
              <div className="sfzcll_smallBk">
                <div className="ygh">
                  <span>4347.2万</span>人
                </div>
              </div>
              <div className="clear"></div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default TollStationFlow;
