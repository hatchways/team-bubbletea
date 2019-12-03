import React, { Component, Fragment } from "react";
import { Header } from "./Header";
import { SignUpButton } from "./SignUpButton";
import { CreateContestPaper } from "./CreateContestPaper";
import { SignInPaper } from "./SignInPaper";
import { BasicTextField } from "./TextField";
import { SignInButton } from "./SignInButton";
import { FormControl, makeStyles, TextField, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    "margin-top": 5,
    "margin-bottom" : 5,
    width: 300,
  },
  caption: {
  	"color": theme.default,
  }
}));

export default function CreateContest() {
  const classes = useStyles();

  return (
    <Fragment>
      <Header>
        <SignUpButton/>
      </Header>
      <CreateContestPaper />
    </Fragment>
  )
}
