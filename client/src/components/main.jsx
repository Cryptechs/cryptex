import React from "react";
import Graph from "./graph.jsx";
import GraphCoin from "./graphCoin.jsx";
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
    console.log("*** changeView/index.jsx: option, view=", view); // so you see whats coming through as the view
    this.setState({
      view: view
    });
  }

  render() {
    const coinIdxToDisplay = +this.state.view.slice(-1) - 1; // get the index number of the coin to be displayed (coin1 => coin[0])

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
        {this.props.candlestickCoinsData === undefined ? (
          <div>Need to refresh to load live data...</div> // when api calls are maxed out
        ) : (
          ""
        )}
        {this.state.view === "wallet" ? (
          <Graph
            data={this.props.wallet.walletHistory}
            coinFullNames={this.props.coinFullNames}
          />
        ) : this.state.view === "coin1" || this.state.view === "coin2" ? (
          <div>
            Researching: {this.props.coinFullNames[coinIdxToDisplay]}
            <Chart
              type={"svg"}
              data={this.props.candlestickCoinsData[coinIdxToDisplay]}
            />
          </div>
        ) : (
          <div>
            Researching: {this.props.coinFullNames[coinIdxToDisplay]}
            <GraphCoin
              data={this.props.coinsData}
              coinName={this.state.view}
              coinFullNames={this.props.coinFullNames}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Main;
