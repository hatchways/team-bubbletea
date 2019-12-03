import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import DateFnsUtils from '@date-io/date-fns';

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import CreateContest from "./pages/CreateContest";

import "./App.css";

function App() {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/login" component={Login} />
            <Route path="/create-contest" component={CreateContest} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default App;
