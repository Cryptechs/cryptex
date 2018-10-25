import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Wallet from "./components/walletValue.jsx";
import Main from "./components/main.jsx";
import Add from "./components/add.jsx";
import { isAbsolute } from "path";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("We here");
    console.log("Micah componenent: ONLINE");
  }

  render() {
    const coinData = [];
    const walletHistory = [];
    for (let i = 50; i > 0; i--) {
      let item = {
        name: "Day -" + i,
        coin1: Math.random() * 2000,
        coin2: Math.random() * 2000,
        coin3: Math.random() * 2000,
        coin4: Math.random() * 2000,
        coin5: Math.random() * 2000
      };
      coinData.push(item);
      walletHistory.push(
        item.coin1 + item.coin2 + item.coin3 + item.coin4 + item.coin5
      );
    }
    console.log("coinData=", coinData);

    const wallet = {};
    wallet.coins = [];
    for (let i = 0; i < 4; i++) {
      wallet.coins.push({
        amount: Math.random() * 10,
        value: Math.random() * 100,
        name: "Coin " + Math.random() * 1000 //giveRandomAlpha(5)
      });
    }
    wallet.walletHistory = { walletHistory };

    return (
      <div>
        <h3>Welcome to Cryptex from react!</h3>
        <Main coinData={coinData} wallet={wallet} />
        <Wallet wallet={wallet} />
        <Add />
        <footer>Bottom of page (names)</footer>
      </div>
    );
  }
}

function giveRandomAlpha(numChars) {
  let res = "";
  for (let i = 0; i < numChars; i++) {
    res += String.fromCharCode(String.toCharCode("A") + Math.random() * 26);
  }
  return res;
}

ReactDOM.render(<App />, document.getElementById("app"));
