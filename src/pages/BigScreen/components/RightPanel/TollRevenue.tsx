import ReactECharts from 'echarts-for-react';
import { option9 } from '../../config/option9';

const TollRevenue: React.FC = () => {
  return (
    <div className="visual_box visualSfzsfl">
      <div className="visual_title">
        <span>收费站收费量</span>
        <img src="/ksh33.png" alt="" />
      </div>
      <div className="visual_chart">
        <ReactECharts option={option9} style={{ height: '100%', width: '100%' }} />
      </div>
      <div className="visual_table">
        <table>
          <tbody>
            <tr>
              <td>小型车</td>
              <td>中型车</td>
              <td>大型车</td>
            </tr>
            <tr>
              <td>2486万</td>
              <td>2486万</td>
              <td>2486万</td>
            </tr>
            <tr>
              <td>2486万</td>
              <td>2486万</td>
              <td>2486万</td>
            </tr>
            <tr>
              <td>2486万</td>
              <td>2486万</td>
              <td>2486万</td>
            </tr>
            <tr>
              <td>2486万</td>
              <td>2486万</td>
              <td>2486万</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TollRevenue;