import React from "react";
import axios from "axios";
import Wallet from "./components/wallet.jsx";
import Main from "./components/main.jsx";
import Add from "./components/add.jsx";
import { isAbsolute } from "path";
import ALPHA_ADVANTAGE_API_KEY from "../config/config.js";
import auth0Client from "./authZero";
import { Link, Redirect } from "react-router-dom";

const coinNames = ["BTC", "LTC", "ETH", "XRP", "EOS"];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: 1, //hardcoded
      coinData: [],
      coinFullNames: [],
      wallet: {}
    };
  }

  componentDidMount() {
    console.log("Component Mounted");
    auth0Client.handleAuthentication();
    //console.log(localStorage, localStorage.profile);
    console.log(auth0Client.isAuthenticated());
    if (!auth0Client.isAuthenticated()) {
      console.log("im here");
    }

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
    this.getLiveCoinDataAndCoinsFullNamesFromAPI(coinNames, coinsData);
  }

  getLiveCoinDataAndCoinsFullNamesFromAPI(mockCoinNames, coinsData) {
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
          //FIX - check for errors from AlphaAdvantage

          // get the crypto ticker name from the response object
          //  && then look it up in our index of coinNames
          let coinIndex = coinNames.indexOf(
            response.data["Meta Data"]["2. Digital Currency Code"]
          );
          if (coinIndex === -1) {
            console.log(
              "Bad Coin Index for ",
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
            eval(`coinsData[${i}].coin${coinIndex + 1} = ${data};`);
          }
          // get full name of this coin
          coinFullNames[coinIndex] =
            response.data["Meta Data"]["3. Digital Currency Name"];

          let wallet = self.createWalletFromCoinsData(coinsData, coinNames); // fix - do this here?

          self.setState({
            coinsData: coinsData,
            wallet: wallet,
            coinFullNames: coinFullNames.slice()
          });
        })
        .catch(function(error) {
          console.log("*** Error Getting data from AlphaAdvantage:", error);
        });
    }
  }

  createMockWalletAndCoinsDataAndCoinNames() {
    // create random data for each coin and create a wallet history
    const coinsData = this.createMockCoinsData();
    let wallet = this.createWalletFromCoinsData(coinsData, coinNames);

    return { wallet, coinsData, coinNames };
  }

  createWalletFromCoinsData(coinsData, coinNames) {
    const walletHistory = [];
    for (let i = 50; i >= 0; i--) {
      let coin1Value = coinsData[i].coin1;
      let coin2Value = coinsData[i].coin2;
      let coin3Value = coinsData[i].coin3;
      let coin4Value = coinsData[i].coin4;
      let coin5Value = coinsData[i].coin5;

      let coin1Amount = 0.01 * Math.random() * (40 - i);
      let coin2Amount = 3 * Math.random() * (40 - i);
      let coin3Amount = 4 * Math.random() * (40 - i);
      let coin4Amount = 2 * Math.random() * (40 - i);
      let coin5Amount = 7 * Math.random() * (40 - i);

      let coin1TotalUSD = coin1Value * coin1Amount;
      let coin2TotalUSD = coin2Value * coin2Amount;
      let coin3TotalUSD = coin3Value * coin3Amount;
      let coin4TotalUSD = coin4Value * coin4Amount;
      let coin5TotalUSD = coin5Value * coin5Amount;

      walletHistory.push({
        timeStamp: "Day -" + i,
        coin1Name: coinNames[0],
        coin2Name: coinNames[1],
        coin3Name: coinNames[2],
        coin4Name: coinNames[3],
        coin5Name: coinNames[4],
        coin1Value: coin1Value,
        coin2Value: coin2Value,
        coin3Value: coin3Value,
        coin4Value: coin4Value,
        coin5Value: coin5Value,
        coin1Amount: coin1Amount,
        coin2Amount: coin2Amount,
        coin3Amount: coin3Amount,
        coin4Amount: coin4Amount,
        coin5Amount: coin5Amount,
        coin1TotalUSD: coin1TotalUSD,
        coin2TotalUSD: coin2TotalUSD,
        coin3TotalUSD: coin3TotalUSD,
        coin4TotalUSD: coin4TotalUSD,
        coin5TotalUSD: coin5TotalUSD
      });
    }
    // Mock wallet data (This is the current state of the wallet, which is array elem 50 of the history of the wallet)
    let wallet = {};
    wallet.coins = [];
    for (let i = 0; i < 5; i++) {
      wallet.coins.push({
        amount: eval(`walletHistory[50].coin${i + 1}Amount`),
        value: eval(`walletHistory[50].coin${i + 1}Value`),
        name: coinNames[i]
      });
    }
    wallet.walletHistory = walletHistory;
    return wallet;
  }

  createMockCoinsData() {
    const coinsData = [];
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
    }
    return coinsData;
  }

  createUser() {
    //post(users/create)
  }
  verifyUser() {
    //get(/users)
  }
  logout() {
    //patch or post(/users/logout)
  }
  retrieveWallet(user) {
    //get (path = '/api/wallet/' +userID)
    axios
      .get("localhost:3000/api/wallets/" + this.state.userID)
      .then(function(response) {
        console.log("You got the data, but are not using the response.");
        //console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  setCoins(c1, c2, c3, c4, c5) {
    axios
      .patch("localhost:3000/api/wallets/" + this.state.userID, {
        c1: c1,
        c2: c2,
        c3: c3,
        c4: c4,
        c5: c5
      })
      .then(function(response) {
        console.log("Did we patch it?");
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return auth0Client.isAuthenticated() ? (
      <div>
        <Link to="/" onClick={auth0Client.signOut}>
          Logout
        </Link>
        <button onClick={auth0Client.handleAuthentication}>Click me</button>
        <h3>Welcome to Cryptex!</h3>
        <Main
          coinsData={this.state.coinsData}
          wallet={this.state.wallet}
          coinFullNames={this.state.coinFullNames}
        />
        <Wallet
          wallet={this.state.wallet}
          coinFullNames={this.state.coinFullNames}
        />
        <Add />
        <div>
          <footer>Micah Weiss, James Dempsey, Chris Athanas</footer>
        </div>
      </div>
    ) : (
      <div>
        <div>Welcome to your Crypto Profile Management Client!</div>
        <Link to="/home">See your profile here</Link> {"<------->"}
        <Link to="/">Link not working? log in here</Link>
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
