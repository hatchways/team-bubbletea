import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';

import { Header } from "./Header";
import { SignUpButton } from "./SignUpButton";
import { HomePagePaper } from "./HomePagePaper";
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
  },
  homePageHeading: {
    margin: "100px 300px 80px 300px",
    fontWeight: 600
  }
}));


export default function HomePage() {
  const classes = useStyles();

  return (
    <Fragment>
      <Header>
        <SignUpButton />
      </Header>
      <Typography className={classes.homePageHeading} variant="h2" justify="left">Welcome to Tattoo Art</Typography>
      <Typography></Typography>
      <Grid container direction="column">
        <HomePagePaper />
      </Grid>     
    </Fragment>
  )
}