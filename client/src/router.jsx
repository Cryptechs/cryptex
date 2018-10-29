import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from "./home.jsx";
import App from "./index.jsx";
import ReactDOM from "react-dom";

const Router = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/home" component={App} />
    </Switch>
  </main>
);
ReactDOM.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
  document.getElementById("app")
);
//export default Router;
