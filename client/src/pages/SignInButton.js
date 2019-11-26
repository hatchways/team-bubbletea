import React from 'react';
import { makeStyles, Button, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    "font-family" : theme.fontFamily,
  },
  button: {
  	"background-color": theme.secondary,
  	"color": theme.bgcolor,
  	"border-radius": "0",
  },
  buttonContainer: {
  	width: "40%",
  	"margin-left": "30%", 
  	"margin-top" : "10%"
  }
}));

export function SignInButton(props) {
  const classes = useStyles();

  return (
    <div>
    <Grid item>
    	<div className={classes.buttonContainer}>
      	<Button type={props.type} fullWidth className={classes.button} variant="contained">
      		<Typography className={classes.root}>
      			Sign In
      		</Typography>
      	</Button>
      </div>
    </Grid>
    </div>
  )
}