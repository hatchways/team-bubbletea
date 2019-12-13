import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Button, ButtonGroup } from '@material-ui/core';
import ProfileSubmission from "./ProfileSubmission";

const useStyles = makeStyles(theme => ({
  container: {
    width: "1400px",
    marginLeft: "auto",
    marginRight: "auto",
    margin: "50px 0",
  },
  paper: {
    width: "100%",
    padding: "60px",
    boxShadow:
      "-5px -5px 10px 3px rgba(209, 209, 209, 0.15), 5px 5px 10px 3px rgba(209, 209, 209, 0.15)",
    borderRadius: "0px"
  },
  header: {
    fontWeight: 600,
    marginTop: "50px",
  },
  buttonSelected: {
    borderRadius: "0px",
    borderBottom: "6px solid black",
    fontSize: "18px"
  },
  buttonUnselected: {
    borderRadius: "0px",
    color: "gray",
    fontSize: "18px"
  }
}));

export function ProfilePaper() {
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container justify="center" alignItems="center" className={classes.container}>
        <Grid item xs={12}>
          <ButtonGroup fullWidth>
            <Button variant="text" className={classes.buttonSelected}>IN PROGRESS</Button>
            <Button variant="text" className={classes.buttonUnselected}>COMPLETED</Button>
          </ButtonGroup>
        </Grid>
        <Paper className={classes.paper}>
          <ProfileSubmission
            image="https://i.imgur.com/pH1nHQ6.png"
            title="Submission 1"
            description="Description for submission 1"
            prizeAmount="150"
          />
          <ProfileSubmission
            image="https://i.imgur.com/2WKG2CK.png"
            title="Submission 2"
            description="Description for submission 2"
            prizeAmount="100"
          />
          <ProfileSubmission
            image="https://i.imgur.com/P2YNXcE.png"
            title="Submission 3"
            description="Description for submission 3"
            prizeAmount="200"
          />
        </Paper>
      </Grid>
    </Fragment>
  )
}

