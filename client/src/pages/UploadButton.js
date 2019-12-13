import React from 'react';
import { makeStyles, Button, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: theme.fontFamily,
  },
  button: {
    backgroundColor: theme.secondary,
    color: theme.bgcolor,
    borderRadius: 0
  },
  buttonContainer: {
    width: 125,
    marginLeft: theme.spacing(44),
    marginTop: theme.spacing(3)
  }
}));

export function UploadButton(props) {
  const classes = useStyles();

  return (
    <div>
      <Grid container alignItems="center">
        <Grid item className={classes.buttonContainer}>
          <Button onClick={props.onClick} type={props.type} fullWidth className={classes.button} variant="contained">
            <Typography className={classes.root}>
              Submit
      		  </Typography>
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}