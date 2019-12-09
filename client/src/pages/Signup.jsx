import React, { useState, Fragment } from 'react';
import { Header } from "./Header";
import { SignUpButton } from "./SignUpButton";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("")

  const handleSignupSubmit = (e) => {
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    })
    .then(response => response.json())
    .then(response => {
      setResult(response.result)
    })
  }

  return (
    <Fragment>
      <Header>
        <SignUpButton />
      </Header>
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}></input>
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}></input>
      <button type="submit" onClick={handleSignupSubmit}>Submit</button>
      <p>{result}</p>
    </Fragment>
  )
}