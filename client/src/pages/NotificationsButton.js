import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

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

export function NotificationsButton() {
  const classes = useStyles();

  return (
  	<Button color="inherit" className={classes.button}>
  		<Typography className={classes.title} variant="button">
        	Notifications
        </Typography>
    </Button>
    )
}