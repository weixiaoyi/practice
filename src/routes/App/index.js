import React, { Component, Suspense } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "../Home";
import SvgChart from "../SvgChart";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/chart"
            render={(props) => <SvgChart {...props} {...this.props} />}
          />
          <Route
            path="/"
            render={(props) => <Home {...props} {...this.props} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
