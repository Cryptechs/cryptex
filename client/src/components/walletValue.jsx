import React from "react";

const Wallet = props => {
  let { wallet } = props;

  return (
    <div className="wallet">
      Total Value = $
      {wallet.coins.reduce((total, i) => {
        total += i.amount * i.value;
      }, 0)}
      <br />
      {wallet.coins.map((i, idx) => {
        return (
          <div key={idx}>
            <br />
            Coin {i.name} :{i.amount} * ${i.value} = ${i.amount * i.value}
          </div>
        );
      })}
    </div>
  );
};

export default Wallet;
