import React from "react";
import axios from "axios";
import Wallet from "./components/wallet.jsx";
import Main from "./components/main.jsx";
import Add from "./components/add.jsx";
import { isAbsolute } from "path";
import ALPHA_ADVANTAGE_API_KEY from "../config/config.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinData: [],
      wallet: {}
    };
  }

  componentDidMount() {
    console.log("Component Mounted");

    // Mock coin data
    const coinData = [];
    const walletHistory = [];
    for (let i = 50; i >= 0; i--) {
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

    let mockCoinNames = ["BTC", "LTC", "ETH", "XRP", "EOS"];
    for (let coinIdx = 0; coinIdx < mockCoinNames.length; coinIdx++) {
      axios
        .get(
          "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=" +
            mockCoinNames[coinIdx] +
            "&market=USD&apikey=" +
            ALPHA_ADVANTAGE_API_KEY
        )
        .then(function(response) {
          // get the crypto ticker name from the response object
          //  && then look it up in our index of coinNames
          let coinIndex = mockCoinNames.indexOf(
            response.data["Meta Data"]["2. Digital Currency Code"]
          );

          console.log("coinIndex=", coinIndex);

          if (coinIndex === -1) {
            console.log(
              "Bad Coinindex for ",
              response.data["Meta Data"]["2. Digital Currency Code"]
            );
          }

          for (let i = 50; i >= 0; i--) {
            let data =
              response.data["Time Series (Digital Currency Daily)"][
                Object.keys(
                  response.data["Time Series (Digital Currency Daily)"]
                )[i]
              ]["4a. close (USD)"];

            // Use the index of the coin from the response
            eval(`coinData[${i}].coin${coinIndex + 1} = ${data};`);
          }
          // this.setState({ coinData: coinData });
        })
        .finally(function() {
          this.setState({ coinData: coinData });
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    // Mock wallet data (This is the current total only)
    let wallet = {};
    wallet.coins = [];
    for (let i = 0; i < 5; i++) {
      wallet.coins.push({
        amount: Math.random() * 10,
        value: Math.random() * 100,
        name: mockCoinNames[i]
      });
    }
    wallet.walletHistory = { walletHistory };

    this.setState({ wallet: wallet, coinData: coinData });
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
    return (
      <div>
        <h3>Welcome to Cryptex!</h3>
        <Main coinData={this.state.coinData} wallet={this.state.wallet} />
        <Wallet wallet={this.state.wallet} />
        <Add />
        <div>
          <footer>Micah Weiss, James Dempsey, Chris Athanas</footer>
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
