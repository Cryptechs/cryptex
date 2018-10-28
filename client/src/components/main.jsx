import React from "react";
import Graph from "./graph.jsx";
import GraphCoin from "./graphCoin.jsx";

// candlestick
import { render } from "react-dom";
import Chart from "./graphCandlestickChart.jsx";

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
          <Graph
            data={this.props.wallet.walletHistory}
            coinFullNames={this.props.coinFullNames}
          />
        ) : // ( <GraphCoin
        //   data={this.props.coinsData}
        //   coinName={this.state.view}
        //   coinFullNames={this.props.coinFullNames}
        // /> )

        this.state.view !== "coin1" ? (
          <GraphCoin
            data={this.props.coinsData}
            coinName={this.state.view}
            coinFullNames={this.props.coinFullNames}
          />
        ) : (
          <Chart type={"svg"} data={this.props.candleData} />
        )}
      </div>
    );
  }
}

export default Main;
