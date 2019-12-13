import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import { EditProfileButton } from "./EditProfileButton";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    marginBottom: "20px"
  },
  profilePictureContainer: {
    height: "150px",
    width: "150px",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "50px",
    marginBottom: "20px"
  },
  profilePicture: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    display: "block",
    borderRadius: "50%",
  },
  profileName: {
    fontWeight: 600,
  }
}));

export function ProfileDetails() {
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container justify="center" className={classes.container}>
        <Grid item xs={12}>
          <div className={classes.profilePictureContainer}>
            <img src="https://i.imgur.com/tha7BKH.png" alt="" className={classes.profilePicture}></img>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography align="center" variant="h4" className={classes.profileName}>
            Kenneth Stewart
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="column" alignItems="center" justify="center">
        <Grid item xs={12}>
          <EditProfileButton />
        </Grid>
      </Grid>
    </Fragment>
  )
}

