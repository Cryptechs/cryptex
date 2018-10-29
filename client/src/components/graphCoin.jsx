import React from "react";

import {
  LineChart,
  Area,
  AreaChart,
  linearGradient,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const GraphCoin = props => {
  // Get the coin name incdex for the coin we are drawing
  let coinNumber = Number(props.coinName.charAt(props.coinName.length - 1) - 1);
  return (
    <div className="graph">
      <AreaChart
        width={800}
        height={400}
        data={props.data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={props.coinName} />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={props.coinName}
          name={props.coinFullNames[coinNumber] + "(USD)"}
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </AreaChart>
    </div>
  );
};

export default GraphCoin;

//'ToDo'
//maybe change size of graph to fit page better
