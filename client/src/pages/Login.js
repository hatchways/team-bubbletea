import React, { Component } from "react";
import { Header } from "./Header";
import { SignUpButton } from "./SignUpButton";
import { SignInPaper } from "./SignInPaper";
import { BasicTextField } from "./TextField";
import { SignInButton } from "./SignInButton";
import { Grid, Typography } from "@material-ui/core";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: ''
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  // Handlers
  handleFormSubmit(e) {
    e.preventDefault();

    fetch('http://localhost:5000/login', { // POST request to backend
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": this.state.email,
        "password": this.state.password
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.token) {
          localStorage.setItem('token', response.token)
          this.props.history.push('/') // Redirect to home page
        } else {
          this.setState({ error: response.error });
        }
      })
  }

  handleEmailChange(emailInput) {
    this.setState({ email: emailInput })
  }

  handlePasswordChange(passwordInput) {
    this.setState({ password: passwordInput })
  }

  handleLogout() {
    localStorage.removeItem('token');
    window.location.reload()
  }

  render() {
    return (
      <div>
      <Header>
      <SignUpButton/>
      </Header>
      <SignInPaper>
        <Grid container direction="column" alignContent="center">
          <form onSubmit={this.handleFormSubmit}>
              <BasicTextField
                label="Email Address"
                value={this.state.email}
                onChange={e => this.handleEmailChange(e.target.value)}
              />
              <BasicTextField
                type="password"
                label="Password"
                value={this.state.password}
                onChange={e => this.handlePasswordChange(e.target.value)}
              />
            <Grid item>
              <Typography variant="caption" color="primary">
                <a href=""> 
                  Forgot Your Password?
                </a>
              </Typography>
            </Grid>
              <SignInButton type="submit" />
          </form>
          <p>{this.state.error}</p>
        </Grid>
      </SignInPaper>
      </div>
    )
  }
}

export default Login;
