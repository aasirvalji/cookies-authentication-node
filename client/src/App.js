import React, { useEffect } from "react";
import {
  Switch,
  Route,
  BrowserRouter as Router,
} from "react-router-dom";

// custom component imports
import Navbar from './components/navbar'
import Landing from './components/landing'
import Routes from './components/routing/Routes'
//Redux imports
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";

function App() {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </>
      </Router>
    </Provider>
  );
}

export default App;
