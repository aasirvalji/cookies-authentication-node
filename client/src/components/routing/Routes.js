import React from "react";
import Register from "../register";
import Login from "../login";
import { Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard";
import PrivateRoute from "../routing/PrivateRoute";

const Routes = () => {
  return (
    <section className="container">
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
      </Switch>
    </section>
  );
};

export default Routes;
