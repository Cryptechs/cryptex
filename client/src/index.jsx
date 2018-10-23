import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("We here");
  }

  render() {
    return <h3>Welcome to Cryptex from react!</h3>;
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
