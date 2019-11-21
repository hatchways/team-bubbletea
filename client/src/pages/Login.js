import React, { Component } from "react";

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
          window.location.reload()
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
        <form onSubmit={this.handleFormSubmit}>
          <input
            type="email"
            value={this.state.email}
            onChange={e => this.handleEmailChange(e.target.value)}
          />
          <input
            type="password"
            value={this.state.password}
            onChange={e => this.handlePasswordChange(e.target.value)}
          />
          <button type="submit">Log in</button>
        </form>
        <p>{this.state.error}</p>
        <p>Token: {localStorage.getItem('token')}</p>
        <button type="button" onClick={this.handleLogout}>Log out</button>
      </div>
    )
  }
}

export default Login;
