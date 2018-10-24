import React from "react";
import Graph from "./graph.jsx";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = [];

    for (let i = 50; i > 0; i--) {
      let item = {
        name: "Day -" + i,
        coin1: Math.random() * 2000,
        coin2: Math.random() * 2000,
        coin3: Math.random() * 2000,
        coin4: Math.random() * 2000,
        coin5: Math.random() * 2000
      };
      item.amt = item.coin1 + item.coin2 + item.coin3 + item.coin4 + item.coin5;
      data.push(item);
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
