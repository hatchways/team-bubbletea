import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(5),
    paddingBottom: theme.spacing(3),
    boxShadow:
      "0px 2px 5px 1px rgba(209, 209, 209, 0.9), 0px 2px 5px -1px rgba(209, 209, 209, 0.9), 0px 1px 5px 0px rgba(209, 209, 209, 0.9), 0px 1px 5px 0px rgba(209, 209, 209, 0.9)",
  },
  position: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: 125,
  },
  header: {
    marginBottom: 30
  }
}));

export function SignInPaper(props) {
  const classes = useStyles();

  return (
    <Grid container justify="center">
      <Grid item xs={9} md={7} lg={5} className={classes.position}>
        <Paper className={classes.paper}>
          <Grid item className={classes.header}>
            <Typography variant="h4" align="center">
              Sign In
            </Typography>
          </Grid>
          {props.children}
        </Paper>
      </Grid>
    </Grid>
  );
}