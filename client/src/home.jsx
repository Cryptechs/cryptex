import React from "react";
import { Link } from "react-router-dom";

const Home = props => (
  <div>
    <Link to={`/login`}>Log in to existing account</Link>
    <Link to={`/signup`}>Create Account</Link>
    <h1>Welcome to Cryptex!</h1>
    <h3>Please log in or sign up</h3>
  </div>
);

export default Home;
