import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Wallet from "./components/walletValue.jsx";
import Main from "./components/main.jsx";
import Add from "./components/add.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("We here");
    console.log("Micah componenent: ONLINE");
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
        <h3>Welcome to Cryptex from react!</h3>
        <Main />
        <Wallet />
        <Add />
        <footer>Bottom of page (names)</footer>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
