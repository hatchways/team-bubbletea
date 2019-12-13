import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(6),
    boxShadow:
      "-5px -5px 10px 3px rgba(209, 209, 209, 0.15), 5px 5px 10px 3px rgba(209, 209, 209, 0.15)",
    borderRadius: "0px"
  },
  position: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: 70,
  },
  header: {
    marginBottom: 30
  },
  signInText: {
    fontWeight: 600
  }
}));

export function SignUpPaper(props) {
  const classes = useStyles();

  return (
    <Grid container justify="center">
      <Grid item xs={9} md={7} lg={4} className={classes.position}>
        <Paper className={classes.paper}>
          <Grid item className={classes.header}>
            <Typography variant="h4" className={classes.signInText} align="center">
              Sign Up
            </Typography>
          </Grid>
          {props.children}
        </Paper>
      </Grid>
    </Grid>
  );
}