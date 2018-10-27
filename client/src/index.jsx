import React from "react";
import axios from "axios";
import Wallet from "./components/wallet.jsx";
import Main from "./components/main.jsx";
import Add from "./components/add.jsx";
import { isAbsolute } from "path";
import ALPHA_ADVANTAGE_API_KEY from "../config/config.js";
import auth0Client from "./authZero";

const coinNames = ["BTC", "LTC", "ETH", "XRP", "EOS"];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinsData: [],
      coinFullNames: [],
      wallet: {}
    };
  }

  componentDidMount() {
    var profile = auth0Client.handleAuthentication();
    setTimeout(() => console.log(profile), 5000);

    // create Mock coin data
    var {
      wallet,
      coinsData,
      coinNames
    } = this.createMockWalletAndCoinsDataAndCoinNames();

    this.setState({
      wallet: wallet,
      coinsData: coinsData,
      coinFullNames: coinNames
    });

    // Get Live data
    //this.getLiveCoinDataAndCoinsFullNamesFromAPI(coinNames, coinData);
  }

  getLiveCoinDataAndCoinsFullNamesFromAPI(mockCoinNames, coinData) {
    let coinFullNames = mockCoinNames.slice();
    for (let coinIdx = 0; coinIdx < mockCoinNames.length; coinIdx++) {
      let self = this;
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
          // get full name of this coin
          coinFullNames[coinIndex] =
            response.data["Meta Data"]["3. Digital Currency Name"];

          self.setState({
            coinData: coinData,
            coinFullNames: coinFullNames.slice()
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  createMockWalletAndCoinsDataAndCoinNames() {
    // create random data for each coin and create a wallet history
    const coinsData = [];
    const walletHistory = [];
    for (let i = 50; i >= 0; i--) {
      let item = {
        timestamp: "Day -" + i,
        coin1: Math.random() * 2000,
        coin2: Math.random() * 2000,
        coin3: Math.random() * 2000,
        coin4: Math.random() * 2000,
        coin5: Math.random() * 2000
      };
      coinsData.push(item);

      walletHistory.push({
        coin1Name: coinNames[0],
        coin2Name: coinNames[1],
        coin3Name: coinNames[2],
        coin4Name: coinNames[3],
        coin5Name: coinNames[4],
        coin1Value: item.coin1,
        coin1Amount: Math.random() * 50,
        coin2Value: item.coin2,
        coin2Amount: Math.random() * 50,
        coin3Value: item.coin3,
        coin3Amount: Math.random() * 50,
        coin4Value: item.coin4,
        coin4Amount: Math.random() * 50,
        coin5Value: item.coin5,
        coin5Amount: Math.random() * 50,
        totalValue:
          item.coin1 + item.coin2 + item.coin3 + item.coin4 + item.coin5
      });
    }

    // Mock wallet data (This is the current total only)
    let wallet = {};
    wallet.coins = [];
    for (let i = 0; i < 5; i++) {
      wallet.coins.push({
        amount: eval(`walletHistory[0].coin${i + 1}Amount`),
        value: eval(`walletHistory[0].coin${i + 1}Value`),
        name: coinNames[i]
      });
    }
    wallet.walletHistory = walletHistory;
    return { wallet, coinsData, coinNames };
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
        <button onClick={auth0Client.signOut}>Logout</button>
        <h3>Welcome to Cryptex!</h3>
        <Main
          coinsData={this.state.coinsData}
          wallet={this.state.wallet}
          coinFullNames={this.state.coinFullNames}
        />
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
