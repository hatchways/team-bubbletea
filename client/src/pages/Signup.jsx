import React, { useState, Fragment } from 'react';
import { Header } from "./Header";
import { SignUpButton } from "./SignUpButton";
import { SignUpPageButton } from "./SignUpPageButton";
import { SignUpPaper } from "./SignUpPaper";
import { Grid, Typography } from "@material-ui/core";
import { BasicTextField } from "./TextField";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [result, setResult] = useState("")

  const handleSignupSubmit = (e) => {
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
        "first_name": firstname,
        "last_name": lastname
      })
    })
    .then(response => response.json())
    .then(response => {
      setResult(response.result);
    })
  }

  return (
    <Fragment>
      <Header>
        <SignUpButton />
      </Header>
      <SignUpPaper>
        <Grid container direction="column" alignContent="center">
          <BasicTextField
            placeholder="Enter your e-mail address"
            type="email"
            label="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <BasicTextField
            placeholder="First name"
            type="text"
            label="First Name"
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
          />
          <BasicTextField
          placeholder="Last name"
          type="text"
          label="Last Name"
          value={lastname}
          onChange={e => setLastname(e.target.value)}
          />
          <BasicTextField
            placeholder="Enter password"
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {/* <button type="submit" onClick={handleSignupSubmit}>Submit</button> */}
          <SignUpPageButton type="submit" onClick={handleSignupSubmit} />
          <p>{result}</p>
        </Grid>
      </SignUpPaper>
    </Fragment>
  )
}