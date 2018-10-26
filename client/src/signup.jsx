import React from "react";
import { Link } from "react-router-dom";

const Signup = props => {
  return (
    <div className="signup">
      <Link to={`/login`}>Log in to existing account</Link>

      <form>
        Create a UserName:
        <input type="text" />
        Create a Password
        <input type="password" />
        Create Account
        <input type="submit" />
      </form>
    </div>
  );
};

export default Signup;
