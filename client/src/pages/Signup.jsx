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
  const [fullname, setFullname] = useState("");
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
        "fullname": fullname
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
            placeholder="Enter your name"
            type="text"
            label="Name"
            value={fullname}
            onChange={e => setFullname(e.target.value)}
          />
          <BasicTextField
            placeholder="Enter password"
            type="email"
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