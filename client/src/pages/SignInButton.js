import React from 'react';
import { makeStyles, Button, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: theme.fontFamily,
  },
  button: {
    backgroundColor: theme.secondary,
    color: theme.bgcolor,
    borderRadius: 0,
  },
  buttonContainer: {
    width: 125,
    marginLeft: theme.spacing(11),
    marginTop: theme.spacing(3)
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