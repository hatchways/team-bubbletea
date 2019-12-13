import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    
  },
  input: {
    display: 'none',
  },
  title: {
    fontFamily: theme.fontFamily,
    fontSize: 10
  }
}));

export function SignUpButton() {
  const classes = useStyles();

  return (
    <Button variant="outlined" color="inherit" className={classes.button}>
      <Typography className={classes.title} variant="button">
        Sign Up
      </Typography>
    </Button>
  )
}