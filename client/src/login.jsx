import React from "react";

const Login = props => {
  return (
    <div className="Login">
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
