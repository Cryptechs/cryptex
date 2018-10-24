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
  return (
    <div class="graph">
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
          dataKey="coin1"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="coin2"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
        <Area
          type="monotone"
          dataKey="coin3"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
        />
        <Area
          type="monotone"
          dataKey="coin4"
          stackId="1"
          stroke="#00c6FF"
          fill="#00c6FF"
        />
        <Area
          type="monotone"
          dataKey="coin5"
          stackId="1"
          stroke="#66c600"
          fill="#66c600"
        />
      </AreaChart>
    </div>
  );
};

export default Graph;
