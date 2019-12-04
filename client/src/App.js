import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Payments from "./pages/Payments";
import Login from "./pages/Login";
import { UploadSubmission } from './pages/UploadSubmission';
import { ViewSubmissions } from './pages/ViewSubmissions';
import { ViewContest } from './pages/ViewContest';

import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>

        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/login" component={Login} />
          <Route path="/payments-demo" component={Payments} />
          <Route path="/upload-submission" component={UploadSubmission} />
          <Route path="/view-submission" component={ViewSubmissions} />
          <Route path="/view-contest" component={ViewContest} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
