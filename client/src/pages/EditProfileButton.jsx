import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: "20px"
  },
  button: {
    borderRadius: "0",
    padding: theme.spacing(2, 3),
    fontWeight: "600",
  },
  input: {
    display: "none"
  }
}))



export function EditProfileButton() {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.container}>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button variant="outlined" className={classes.button} component="span"> 
            Edit Profile
          </Button>
        </label>
      </div>
    </Fragment>
  )
}