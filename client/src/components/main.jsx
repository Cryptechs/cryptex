import React from "react";
import Graph from "./graph.jsx";
import GraphCoin from "./graphCoin.jsx";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "wallet"
    };

    this.changeView = this.changeView.bind(this);
  }

  changeView(view, event) {
    console.log("*** changeView/index.jsx: option, view=", view);
    this.setState({
      view: view
    });
  }

  render() {
    return (
      <div className="main">
        <div className="graphButtons">
          <button onClick={() => this.changeView("wallet")}>Wallet</button>
          <button onClick={() => this.changeView("coin1")}>Coin 1</button>
          <button onClick={() => this.changeView("coin2")}>Coin 2</button>
          <button onClick={() => this.changeView("coin3")}>Coin 3</button>
          <button onClick={() => this.changeView("coin4")}>Coin 4</button>
          <button onClick={() => this.changeView("coin5")}>Coin 5</button>
        </div>
        {this.state.view === "wallet" ? (
          <Graph data={this.props.coinData} />
        ) : (
          <GraphCoin data={this.props.coinData} coinName={this.state.view} />
        )}
      </div>
    );
  }
}

export default Main;
