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
  	"width": "10%",
  	"margin-left": "45%", 
  	"margin-top" : "2%"
  }
}));

export function UploadButton(props) {
  const classes = useStyles();

  return (
    <div>
    <Grid item>
    	<div className={classes.buttonContainer}>
      	<Button onClick={props.onClick} type={props.type} fullWidth className={classes.button} variant="contained">
      		<Typography className={classes.root}>
      			Submit
      		</Typography>
      	</Button>
      </div>
    </Grid>
    </div>
  )
}