import React from "react";
import Graph from "./graph.jsx";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main">
        <div className="graphButtons">
          <button>Wallet</button>
          <button>Coin 1</button>
          <button>Coin 2</button>
          <button>Coin 3</button>
          <button>Coin 4</button>
          <button>Coin 5</button>
        </div>
        <Graph data={this.props.coinData} />
      </div>
    );
  }
}

export default Main;
