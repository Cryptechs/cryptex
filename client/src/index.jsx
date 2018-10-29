import React from "react";
import axios from "axios";
import Wallet from "./components/wallet.jsx";
import Main from "./components/main.jsx";
import Add from "./components/add.jsx";
import ALPHA_ADVANTAGE_API_KEY from "../config/config.js";
import auth0Client from "./authZero";
import { Link } from "react-router-dom";

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
    auth0Client.handleAuthentication(); //takes time to come back as true
    // console.log(localStorage, localStorage.profile); //username stored here
    console.log(auth0Client.isAuthenticated());
    if (!auth0Client.isAuthenticated()) {
      console.log("user is NOT authorized");
    }

    this.retrieveWallet(wallet => {
      //grab logged in users wallet, set it to state, and grab live coin data from api
      this.getLiveCoinDataAndCoinFullNamesFromAPI(coinNames);
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

    // These next 2 lines cause React to update the UI, by giving it a full new array instead of replacing an element in the array.
    this.state.wallet.walletHistory = this.state.wallet.walletHistory.slice();
    this.state.wallet.coins = this.state.wallet.coins.slice();
    this.setState({ wallet: wallet });

    // send this new wallet to the server,FIX ME: may not be necessary
    this.saveWallet(wallet);
  }

  getLiveCoinDataAndCoinFullNamesFromAPI(coinNames) {
    //read function title, gets daily totals (not historical)
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
          //TODO - check for errors from AlphaAdvantage : limited to 5 req per minute, you will see this error often :)
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
              //FIX ME return here?
            );
          }

          // Get the basic coins data
          for (let i = 50; i >= 0; i--) {
            let data =
              response.data["Time Series (Digital Currency Daily)"][
                Object.keys(
                  response.data["Time Series (Digital Currency Daily)"]
                )[i]
              ]["4a. close (USD)"]; //closing data, theres also opening and low, high, all sorts of stuff. (Basic chart graph)
            // Use the index of the coin from the response
            if (coinsData[i] === undefined) coinsData[i] = {};
            eval(`coinsData[${i}].coin${coinIndex + 1} = ${data};`);
          }
          // get full name of this coin
          coinFullNames[coinIndex] =
            response.data["Meta Data"]["3. Digital Currency Name"];

          // Candlestick data format, needs a lot more info than basic chart graph.
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
              open: +row["1a. open (USD)"], // + is a trick to convert to a number (comes in as a string)
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
    self = this; // need to assign context to a variable, 'this' gets lost farther down in scope

    axios
      .post("/users/create", {
        username: localStorage.name
      })
      .then(function(response) {
        console.log("new user created: ", localStorage.name);
        self.retrieveWallet(callback);
      });
  }

  retrieveWallet(callback) {
    self = this; //see above
    axios
      .get("/api/wallet/" + localStorage.name)
      .then(function(response) {
        console.log("GET request fired from index.jsx");
        if (response.data === "" || response.data.length === 0) {
          console.log("No existing wallet. Creating new Wallet");
          self.createUser(callback);
        } else {
          console.log("retrieveWallet() success response.data=", response.data);
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
    for (let i = 0; i < serverWalletLength; i++) {
      walletHistory.push({
        timeStamp: serverWallet[i].timestamp,
        coin1Name: coinNames[0],
        coin2Name: coinNames[1],
        coin3Name: coinNames[2],
        coin4Name: coinNames[3],
        coin5Name: coinNames[4],
        coin1Value: serverWallet[i].c1_value, // refactor to arrays? (n coins instead of five coins)
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

    //load server wallet newest (last) timestamp data as the current wallet. (latest timestamps are pushed to the end)
    wallet.coins = [];
    for (let i = 0; i < 5; i++) {
      wallet.coins.push({
        amount: eval(
          `walletHistory[${serverWalletLength - 1}].coin${i + 1}Amount`
        ),
        value: eval(
          `walletHistory[${serverWalletLength - 1}].coin${i + 1}Value`
        ),
        name: coinNames[i]
      });
      this.state.coinFullNames[i] = coinNames[i];
    }
    wallet.timeStamp = wallet.walletHistory[serverWalletLength - 1].timeStamp;
    return wallet;
  }

  saveWallet(wallet) {
    axios
      .patch("/api/wallet/" + localStorage.name, {
        // Fix also save values of coins here? potential refactor. user server or client time? timestamp current overwritten by server
        c1: wallet.coins[0].amount,
        c2: wallet.coins[1].amount,
        c3: wallet.coins[2].amount,
        c4: wallet.coins[3].amount,
        c5: wallet.coins[4].amount,
        timestamp: wallet.timeStamp
      })
      .then(function(response) {
        console.log("saveWallet: patched, response=", response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return auth0Client.isAuthenticated() ? ( //if user is not authenticated, they only have access to to the footer
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
      //---------------------------------------------------------------------------------------- footer here
      <div>
        <div>Welcome to your Crypto Profile Management Client!</div>
        <Link to="/home">See your profile here</Link> {"<------->"}{" "}
        {/*only renders if user is authenticaed, and the redirects to main content */}
        <Link to="/">Link not working? log in here</Link>
      </div>
    );
  }
}

export default App;
