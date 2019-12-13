import React from "react";
import { makeStyles, Button, Typography, Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: theme.fontFamily,
  },
  button: {
    backgroundColor: "black",
    color: theme.bgcolor,
    borderRadius: "0",
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
          <Button type={props.type} className={classes.button} variant="contained" onClick={props.onClick}>
            <Typography className={classes.root}>
              Create Contest
      		  </Typography>
          </Button>
        </div>
      </Grid>
    </div>
  )
}