import React from "react";

const Wallet = props => {
  let { wallet, coinFullNames } = props;

  if (wallet === undefined || wallet.coins === undefined)
    return <div>Loading data...</div>;
  else {
    return (
      <div className="wallet">
        Total Wallet Value = $
        {wallet.coins
          .reduce((total, i) => (total = total + i.amount * i.value), 0)
          .toFixed(2)}
        <br />
        {wallet.coins.map((i, idx) => {
          return (
            <div key={idx}>
              {coinFullNames[idx]}
              :&nbsp;

              {i.amount.toFixed(3)} * ${i.value.toFixed(2)} = $
              {(i.amount * i.value).toFixed(2)}
            </div>
          );
        })}
      </div>
    );
  }
};

export default Wallet;
