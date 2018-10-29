import React from "react";
import { Link } from "react-router-dom";
import auth0Client from "./authZero";
import axios from "axios";

const Home = props => (
  <div>
    <button onClick={auth0Client.signIn}>Sign in here</button>
    <h1>Welcome to Cryptex!</h1>
    <h3>Please use above button to sign up or log in an existing account</h3>
  </div>
);

export default Home;

//when you click sign in, redirected to auth0 client page
//please use css and make this a bit more presentable
