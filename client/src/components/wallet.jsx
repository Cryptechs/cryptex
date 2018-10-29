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
          .toPrecision(3)}
        <br />
        {wallet.coins.map((i, idx) => {
          return (
            <div key={idx}>
              {coinFullNames[idx]}
              :&nbsp;
              {i.amount.toPrecision(3)} * ${i.value.toPrecision(3)} = $
              {(i.amount * i.value).toPrecision(3)}
            </div>
          );
        })}
      </div>
    );
  }
};

export default Wallet;
