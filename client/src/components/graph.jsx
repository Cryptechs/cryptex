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

const Graph = props => {
  if (props.data === undefined || props.data.length === 0)
    return <div>loading data....</div>;
  else
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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="coin1TotalUSD"
            name={props.coinFullNames[0] + "(USD)"}
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            type="monotone"
            dataKey="coin2TotalUSD"
            name={props.coinFullNames[1] + "(USD)"}
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
          <Area
            type="monotone"
            dataKey="coin3TotalUSD"
            name={props.coinFullNames[2] + "(USD)"}
            stackId="1"
            stroke="#ffc658"
            fill="#ffc658"
          />
          <Area
            type="monotone"
            dataKey="coin4TotalUSD"
            name={props.coinFullNames[3] + "(USD)"}
            stackId="1"
            stroke="#00c6FF"
            fill="#00c6FF"
          />
          <Area
            type="monotone"
            dataKey="coin5TotalUSD"
            name={props.coinFullNames[4] + "(USD)"}
            stackId="1"
            stroke="#66c600"
            fill="#66c600"
          />
        </AreaChart>
      </div>
    );
};

export default Graph;
