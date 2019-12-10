import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';

import { Header } from "./Header";
import { SignUpButton } from "./SignUpButton";
import { ProfilePaper } from "./ProfilePaper";
import { ProfileDetails } from "./ProfileDetails";

const useStyles = makeStyles(theme => ({
  paper: {
    width: "70%",
    padding: "5%",
    margin: "5% 0",
    boxShadow:
      "-5px -5px 10px 3px rgba(209, 209, 209, 0.15), 5px 5px 10px 3px rgba(209, 209, 209, 0.15)"
  },
  header: {
    fontWeight: 600,
    marginTop: "5%",
  }
}));

export default function Profile() {
  const classes = useStyles();

  return (
    <Fragment>
      <Header>
        <SignUpButton />
      </Header>
      <ProfileDetails />
      <ProfilePaper />
    </Fragment>
  )
}
