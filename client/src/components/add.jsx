import React from "react";
import CoinAmountForm from "./CoinAmountForm.jsx";

class Add extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="addCoins">
          <CoinAmountForm
            handleUpdateCoinAmounts={this.props.handleUpdateCoinAmounts}
            coinUIName="coin 1"
            coinFullName={this.props.coinFullNames[0]}
          />
          <CoinAmountForm
            handleUpdateCoinAmounts={this.props.handleUpdateCoinAmounts}
            coinUIName="coin 2"
            coinFullName={this.props.coinFullNames[1]}
          />
          <CoinAmountForm
            handleUpdateCoinAmounts={this.props.handleUpdateCoinAmounts}
            coinUIName="coin 3"
            coinFullName={this.props.coinFullNames[2]}
          />
          <CoinAmountForm
            handleUpdateCoinAmounts={this.props.handleUpdateCoinAmounts}
            coinUIName="coin 4"
            coinFullName={this.props.coinFullNames[3]}
          />
          <CoinAmountForm
            handleUpdateCoinAmounts={this.props.handleUpdateCoinAmounts}
            coinUIName="coin 5"
            coinFullName={this.props.coinFullNames[4]}
          />
        </div>
      </div>
    );
  }
}

export default Add;
