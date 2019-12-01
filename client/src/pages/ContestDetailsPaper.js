import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid } from '@material-ui/core';
import { BackToContestsListButton } from './BackToContestsListsButton';

const useStyles = makeStyles(theme => ({
  root: {
    "padding-bottom": "1%",
    "padding-top": "0.5%",
    "box-shadow": null, 
  },
  title: {
    "margin-left": "8.5%",
    display: "flex"
  },
  prize: {
    "margin-left": "25%",
    "margin-right": "65%",
  },
  button: {
    "margin-left": "8.5%"
  },
  // titleDiv: {
  //   display: "flex", 
  // }
}));

export function ContestDetailsPaperSheet() {
  const classes = useStyles();

  return (
    <Grid container justify="center">
        <Grid item xs={9} md={7} lg={12} className={classes.position}>
            <Paper className={classes.root}>
              <Grid item className={classes.button}>
                <BackToContestsListButton />
              </Grid>
              <Grid item className={classes.title}>
                <div className={classes.titleDiv}>
                  <Typography variant="h4">
                    Contest Title
                  </Typography>
                  <Typography variant="h6">
                    $150
                  </Typography>
                </div>
              </Grid>
              <Grid item className={classes.title}>
                <Typography variant="caption">
                  Author name.
                </Typography>
              </Grid>
            </Paper>
        </Grid>
    </Grid>
  );
}