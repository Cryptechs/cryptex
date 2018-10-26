import React from "react";
import { Link } from "react-router-dom";

const Login = props => {
  return (
    <div className="Login">
      <Link to={`/signup`}>Create Account</Link>
      <form>
        Username: <input type="text" />
        Password
        <input type="password" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Login;
