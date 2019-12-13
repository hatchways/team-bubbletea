import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none',
  },
  title: {
    fontFamily: theme.fontFamily,
    fontSize: 10,
    padding: 5
  }
}));

export function BackToContestsListButton() {
  const classes = useStyles();

  return (
    // <Button color="inherit" className={classes.button}>
    //   <ArrowBackIcon />
    //   <Typography className={classes.title} variant="caption">
    //     Back to contests' list
    //     </Typography>
    // </Button>
    <Link to="/view-contest">Go back to all contests</Link>
  )
}