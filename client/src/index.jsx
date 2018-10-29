import React from "react";
import axios from "axios";
import Wallet from "./components/wallet.jsx";
import Main from "./components/main.jsx";
import Add from "./components/add.jsx";
import { isAbsolute } from "path";
import ALPHA_ADVANTAGE_API_KEY from "../config/config.js";
import auth0Client from "./authZero";
import { Link, Redirect } from "react-router-dom";
import { create } from "domain";
import { runInThisContext } from "vm";

// candlestick charting /
import { render } from "react-dom";
import { getData } from "./components/utils";

const coinNames = ["BTC", "LTC", "ETH", "XRP", "EOS"];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coinData: [],
      coinFullNames: [],
      wallet: {},
      coinCandlestickData: []
    };

    this.handleUpdateCoinAmounts = this.handleUpdateCoinAmounts.bind(this);
  }

  componentDidMount() {
    console.log("Component Mounted");
    auth0Client.handleAuthentication();
    // console.log(localStorage, localStorage.profile);
    console.log(auth0Client.isAuthenticated());
    if (!auth0Client.isAuthenticated()) {
      console.log("im here");
    }

    // // create Mock coin data -- Leave here for testing
    // var {
    //   wallet,
    //   coinsData,
    //   coinNames
    // } = this.createMockWalletAndCoinsDataAndCoinNames();

    this.retrieveWallet(wallet => {
      this.getLiveCoinDataAndCoinFullNamesFromAPI(coinNames);

      // getData().then(candleData => {
      //   console.log("candleData=", candleData);
      //   this.setState({ candleData: candleData });
      // });

      this.setState({
        wallet: wallet
      });
    });
  }

  handleUpdateCoinAmounts(coinUIName, amount) {
    console.log("handleUpdateCoinAmounts=", coinUIName, amount);
    let coinNameIdx = Number(coinUIName.split(" ")[1]) - 1; //'Coin 1'  ==> coins[0]

    // set the current number of coins to the new amount of coins
    let wallet = this.state.wallet;

    //Update the last entry for the walletHistory to reflect new amount of coins
    let updateTimeStampIdx = wallet.walletHistory.length - 1;

    // Update the wallet with new number of coins
    eval(`wallet.coins[${coinNameIdx}].amount = ${amount}`);

    // Update the walletHistory coin amount and totalUSD
    eval(
      `wallet.walletHistory[${updateTimeStampIdx}].coin${coinNameIdx +
        1}Amount = ${amount}`
    );
    eval(
      `wallet.walletHistory[${updateTimeStampIdx}].coin${coinNameIdx +
        1}TotalUSD = ${amount} * wallet.coins[${coinNameIdx}].value`
    );

    // These next 2 lines cause React to update the UI
    this.state.wallet.walletHistory = this.state.wallet.walletHistory.slice();
    this.state.wallet.coins = this.state.wallet.coins.slice();
    this.setState({ wallet: wallet });

    // send this new wallet to the server
    this.saveWallet(wallet);
  }

  getLiveCoinDataAndCoinFullNamesFromAPI(coinNames) {
    let coinFullNames = coinNames.slice();
    let coinsData = [];
    const candlestickCoinsData = [];
    for (let coinIdx = 0; coinIdx < coinNames.length; coinIdx++) {
      let self = this;
      axios
        .get(
          "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=" +
            coinNames[coinIdx] +
            "&market=USD&apikey=" +
            ALPHA_ADVANTAGE_API_KEY
        )
        .then(function(response) {
          //TODO - check for errors from AlphaAdvantage
          console.log("AlphaAdvantage response:", response.data);

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

          // Get the basic coins data
          for (let i = 50; i >= 0; i--) {
            let data =
              response.data["Time Series (Digital Currency Daily)"][
                Object.keys(
                  response.data["Time Series (Digital Currency Daily)"]
                )[i]
              ]["4a. close (USD)"];
            // Use the index of the coin from the response
            if (coinsData[i] === undefined) coinsData[i] = {};
            eval(`coinsData[${i}].coin${coinIndex + 1} = ${data};`);
          }
          // get full name of this coin
          coinFullNames[coinIndex] =
            response.data["Meta Data"]["3. Digital Currency Name"];

          //let wallet = self.createWalletFromCoinsData(coinsData, coinNames); // only for mock data

          // Candlestick data format
          let timeSeriesKeys = Object.keys(
            response.data["Time Series (Digital Currency Daily)"]
          );
          candlestickCoinsData[coinIndex] = [];
          for (let i = timeSeriesKeys.length - 1; i >= 0; i--) {
            let row =
              response.data["Time Series (Digital Currency Daily)"][
                timeSeriesKeys[i]
              ];

            let timeSeriesDate = timeSeriesKeys[i].split("-"); //2018-10-27
            let formattedRow = {
              date: new Date(
                timeSeriesDate[0],
                timeSeriesDate[1] - 1, // in js Date, months are zero based
                timeSeriesDate[2]
              ), // Month, Day, Year
              open: +row["1a. open (USD)"],
              high: +row["2a. high (USD)"],
              low: +row["3a. low (USD)"],
              close: +row["4a. close (USD)"],
              volume: +row["5. volume"],
              marketCap: +row["6. market cap (USD)"],
              coinName: coinNames[coinIndex],
              coinFullName: coinFullNames[coinIndex]
            };
            candlestickCoinsData[coinIndex].push(formattedRow);
          }

          self.setState({
            candlestickCoinsData: candlestickCoinsData,
            coinsData: coinsData,
            // wallet: wallet, // mock only
            coinFullNames: coinFullNames.slice()
          });
        })
        .catch(function(error) {
          console.log("*** Error Getting data from AlphaAdvantage:", error);
        });
    }
  }

  //This method is called inside retrieve wallet if no wallets are found.
  createUser(callback) {
    //mjw- untested
    self = this;

    axios
      .post("/users/create", {
        username: localStorage.name
      })
      .then(function(response) {
        console.log("new user created");
        //you can set state stuff here
        //or alternatively you can invoke retrieveWallet
        self.retrieveWallet(callback);
      });
  }

  retrieveWallet(callback) {
    //mjw- untested
    //get (path = '/api/wallet/' +userID)
    self = this;
    axios
      .get("/api/wallet/" + localStorage.name)
      .then(function(response) {
        console.log("GET wallet successful:");
        if (response.data === "" || response.data.length === 0) {
          console.log("No existing wallet. Creating new Wallet");
          self.createUser(callback);
        } else {
          console.log("retrieveWallet() response.data=", response.data);
          var serverWallet = response.data;
          var wallet = self.convertServerWalletToClientWallet(serverWallet);
          callback(wallet);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  convertServerWalletToClientWallet(serverWallet) {
    const wallet = {};

    let serverWalletLength = serverWallet.length;

    //load server wallet timestamps into client wallet.walletHistory;
    const walletHistory = [];
    for (let i = serverWalletLength - 1; i >= 0; i--) {
      walletHistory.push({
        timeStamp: serverWallet[i].timestamp,
        coin1Name: coinNames[0],
        coin2Name: coinNames[1],
        coin3Name: coinNames[2],
        coin4Name: coinNames[3],
        coin5Name: coinNames[4],
        coin1Value: serverWallet[i].c1_value,
        coin2Value: serverWallet[i].c2_value,
        coin3Value: serverWallet[i].c3_value,
        coin4Value: serverWallet[i].c4_value,
        coin5Value: serverWallet[i].c5_value,
        coin1Amount: serverWallet[i].c1_amount,
        coin2Amount: serverWallet[i].c2_amount,
        coin3Amount: serverWallet[i].c3_amount,
        coin4Amount: serverWallet[i].c4_amount,
        coin5Amount: serverWallet[i].c5_amount,
        coin1TotalUSD: serverWallet[i].c1_value * serverWallet[i].c1_amount,
        coin2TotalUSD: serverWallet[i].c2_value * serverWallet[i].c2_amount,
        coin3TotalUSD: serverWallet[i].c3_value * serverWallet[i].c3_amount,
        coin4TotalUSD: serverWallet[i].c4_value * serverWallet[i].c4_amount,
        coin5TotalUSD: serverWallet[i].c5_value * serverWallet[i].c5_amount
      });
    }
    wallet.walletHistory = walletHistory.slice();

    //load server wallet last timestamp data as the current wallet.
    wallet.coins = [];
    for (let i = 0; i < 5; i++) {
      wallet.coins.push({
        amount: eval(`walletHistory[serverWalletLength-1].coin${i + 1}Amount`),
        value: eval(`walletHistory[serverWalletLength-1].coin${i + 1}Value`),
        name: coinNames[i]
      });
      this.state.coinFullNames[i] = coinNames[i];
    }
    wallet.timeStamp = wallet.walletHistory[serverWalletLength - 1].timeStamp;

    return wallet;
  }

  saveWallet(wallet) {
    //mjw- untested
    let self = this;
    axios
      .patch("/api/wallet/" + localStorage.name, {
        // Fix also save values of coins here?
        c1: wallet.coins[0].amount,
        c2: wallet.coins[1].amount,
        c3: wallet.coins[2].amount,
        c4: wallet.coins[3].amount,
        c5: wallet.coins[4].amount,
        timestamp: wallet.timeStamp
      })
      .then(function(response) {
        console.log("saveWallet: patched, response=", response);
        //self.setState({wallet:wallet});
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
          candlestickCoinsData={this.state.candlestickCoinsData}
        />
        <Wallet
          wallet={this.state.wallet}
          coinFullNames={this.state.coinFullNames}
        />
        <Add
          handleUpdateCoinAmounts={this.handleUpdateCoinAmounts}
          coinFullNames={this.state.coinFullNames}
        />
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

  // // For mock and testing
  // createMockWalletAndCoinsDataAndCoinNames() {
  //   // create random data for each coin and create a wallet history
  //   const coinsData = this.createMockCoinsData();
  //   let wallet = this.createWalletFromCoinsData(coinsData, coinNames);

  //   return { wallet, coinsData, coinNames };
  // }

  // // For mock and testing
  // createWalletFromCoinsData(coinsData, coinNames) {
  //   const walletHistory = [];
  //   for (let i = 50; i >= 0; i--) {
  //     let coin1Value = coinsData[i].coin1;
  //     let coin2Value = coinsData[i].coin2;
  //     let coin3Value = coinsData[i].coin3;
  //     let coin4Value = coinsData[i].coin4;
  //     let coin5Value = coinsData[i].coin5;

  //     let coin1Amount = 0.01 * Math.random() * (40 - i);
  //     let coin2Amount = 3 * Math.random() * (40 - i);
  //     let coin3Amount = 4 * Math.random() * (40 - i);
  //     let coin4Amount = 2 * Math.random() * (40 - i);
  //     let coin5Amount = 7 * Math.random() * (40 - i);

  //     let coin1TotalUSD = coin1Value * coin1Amount;
  //     let coin2TotalUSD = coin2Value * coin2Amount;
  //     let coin3TotalUSD = coin3Value * coin3Amount;
  //     let coin4TotalUSD = coin4Value * coin4Amount;
  //     let coin5TotalUSD = coin5Value * coin5Amount;

  //     walletHistory.push({
  //       timeStamp: "Day -" + i,
  //       coin1Name: coinNames[0],
  //       coin2Name: coinNames[1],
  //       coin3Name: coinNames[2],
  //       coin4Name: coinNames[3],
  //       coin5Name: coinNames[4],
  //       coin1Value: coin1Value,
  //       coin2Value: coin2Value,
  //       coin3Value: coin3Value,
  //       coin4Value: coin4Value,
  //       coin5Value: coin5Value,
  //       coin1Amount: coin1Amount,
  //       coin2Amount: coin2Amount,
  //       coin3Amount: coin3Amount,
  //       coin4Amount: coin4Amount,
  //       coin5Amount: coin5Amount,
  //       coin1TotalUSD: coin1TotalUSD,
  //       coin2TotalUSD: coin2TotalUSD,
  //       coin3TotalUSD: coin3TotalUSD,
  //       coin4TotalUSD: coin4TotalUSD,
  //       coin5TotalUSD: coin5TotalUSD
  //     });
  //   }
  //   // Mock wallet data (This is the current state of the wallet, which is array elem 50 of the history of the wallet)
  //   let wallet = {};
  //   wallet.coins = [];
  //   for (let i = 0; i < 5; i++) {
  //     wallet.coins.push({
  //       amount: eval(`walletHistory[50].coin${i + 1}Amount`),
  //       value: eval(`walletHistory[50].coin${i + 1}Value`),
  //       name: coinNames[i]
  //     });
  //   }
  //   wallet.walletHistory = walletHistory;
  //   return wallet;
  // }

  // // for mock and testing
  // createMockCoinsData() {
  //   const coinsData = [];
  //   for (let i = 50; i >= 0; i--) {
  //     let item = {
  //       timestamp: "Day -" + i,
  //       coin1: Math.random() * 2000,
  //       coin2: Math.random() * 2000,
  //       coin3: Math.random() * 2000,
  //       coin4: Math.random() * 2000,
  //       coin5: Math.random() * 2000
  //     };
  //     coinsData.push(item);
  //   }
  //   return coinsData;
  // }
}

export default App;
