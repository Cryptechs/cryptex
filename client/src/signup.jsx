import React from "react";

const Signup = props => {
  return (
    <div className="signup">
      <form>
        <input type="text">Create a UserName:</input>
        <input type="password">Create a Password</input>
        <input type="submit">Create Account</input>
      </form>
    </div>
  );
};

export default Signup;
