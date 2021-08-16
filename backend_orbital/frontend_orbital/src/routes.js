import React from "react";

import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";

import Login from "./pages/login";
import SignUp from "./pages/signup";
import Home from "./pages/home";


const authGuard = (Component) => () => {
  return localStorage.getItem("token") ? (
    <Component />
  ) : (
    <Redirect to="/login" />
  );
};
const Routes = (props) => (
  <Router {...props}>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/sign-up">
        <SignUp />
      </Route>
      <Route path="/" render={authGuard(Home)}></Route>
      <Route exact path="/">
        <Redirect to="/" />
      </Route>
    </Switch>
  </Router>
);

export default Routes;