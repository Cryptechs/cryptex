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
          <button>Coin 1 add</button> +form input
          <button>Coin 2 add</button> +form input
          <button>Coin 3 add</button> +form input
          <button>Coin 4 add</button> +form input
          <button>Coin 5 add</button> +form input
        </div>
      </div>
    );
  }
}

export default Add;
