import React from "react";
import Graph from "./graph.jsx";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = [];

    for (let i = 50; i > 0; i--) {
      data.push({
        name: "Day -" + i,
        uv: Math.random() * 2000,
        pv: Math.random() * 2000,
        amt: Math.random() * 2000
      });
    }
    console.log("data=", data);

    return (
      <div class="main">
        <div class="graphButtons">
          <button>Wallet</button>
          <button>Coin 1</button>
          <button>Coin 2</button>
          <button>Coin 3</button>
          <button>Coin 4</button>
          <button>Coin 5</button>
        </div>
        <Graph data={data} />
      </div>
    );
  }
}

export default Main;
