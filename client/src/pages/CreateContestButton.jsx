import React from 'react';
import { makeStyles, Button, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    "font-family" : theme.fontFamily,
  },
  button: {
  	"background-color": "black",
  	"color": theme.bgcolor,
    "border-radius": "0",
    padding: theme.spacing(4, 10)
  },
  buttonContainer: {
  	marginTop: "50px"
  }
}));

export function CreateContestButton(props) {
  const classes = useStyles();

  return (
    <div>
    <Grid container justify="center">
    	<div className={classes.buttonContainer}>
      	<Button type={props.type} className={classes.button} variant="contained">
      		<Typography className={classes.root}>
      			Create Contest
      		</Typography>
      	</Button>
      </div>
    </Grid>
    </div>
  )
}