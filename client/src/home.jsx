import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./router.jsx";

const Home = props => {
  return (
    <div>
      <h1>Welcome to Cryptex!</h1>
      <h3>Please log in or sign up</h3>
    </div>
  );
};

export default Home;
