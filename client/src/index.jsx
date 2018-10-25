import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Wallet from "./components/walletValue.jsx";
import Main from "./components/main.jsx";
import Add from "./components/add.jsx";
import { isAbsolute } from "path";
//import { BrowserRouter } from "react-router-dom";

// comment testing gitignore

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("We here");
  }
  createUser() {
    //post(users/create)
  }
  verifyUser() {
    //get(/users)
  }
  addCoins() {
    //patch(/wallet/get)
  }
  retrieveWallet(user) {
    //get(/api/coins)
  }
  getCoinHistory(coin) {
    //get (/api)
  }
  logout() {
    //patch or post(/users/logout)
  }

  render() {
    // Mock coin data
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

    // Mock wallet data
    const wallet = {};
    wallet.coins = [];
    for (let i = 0; i < 5; i++) {
      wallet.coins.push({
        amount: Math.random() * 10,
        value: Math.random() * 100,
        name: giveRandomAlpha(5)
      });
    }
    wallet.walletHistory = { walletHistory };

    return (
      <div>
        <h3>Welcome to Cryptex!</h3>
        <Main coinData={coinData} wallet={wallet} />
        <Wallet wallet={wallet} />
        <Add />
        <div>
          <footer>
            Micah Weiss, James Dempsey, Chris Athanas (Reverse Alphabetic Order
            by First and Last Name)
          </footer>
        </div>
      </div>
    );
  }
}

function giveRandomAlpha(numChars) {
  let res = "";
  for (let i = 0; i < numChars; i++) {
    res += String.fromCharCode(65 + Math.random() * 26);
  }
  return res;
}

export default App;
//ReactDOM.render(<App />, document.getElementById("app"));
