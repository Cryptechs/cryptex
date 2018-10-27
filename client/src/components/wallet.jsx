import React from "react";

const Wallet = props => {
  let { wallet } = props;

  if (wallet === undefined || wallet.coins === undefined)
    return <div>Loading data...</div>;
  else
    return (
      <div className="wallet">
        Total Wallet Value = $
        {wallet.coins
          .reduce((total, i) => (total = total + i.amount * i.value), 0)
          .toPrecision(5)}
        <br />
        {wallet.coins.map((i, idx) => {
          return (
            <div key={idx}>
              Coin Name:
              {i.name} :{i.amount.toPrecision(4)} * ${i.value.toPrecision(4)} =
              ${(i.amount * i.value).toPrecision(5)}
            </div>
          );
        })}
      </div>
    );
};

export default Wallet;
