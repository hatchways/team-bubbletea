import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  	"margin-right" : "2%",
  },
  input: {
    display: 'none',
  },
  title: {
  	"font-family" : theme.fontFamily,
  	"font-size" : "10px",
  	padding : "5px"
  }
}));

export function BackToContestsListButton() {
  const classes = useStyles();

  return (
  	<Button color="inherit" className={classes.button}>
        <ArrowBackIcon/>
  	    <Typography className={classes.title} variant="caption">
            Back to contests' list
        </Typography>
    </Button>
    )
}