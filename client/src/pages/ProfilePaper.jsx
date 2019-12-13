import React, { Fragment, useState, useEffect } from 'react';
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
  const [data, setData] = useState([]);
  const [tab, setTab] = useState(0);

  const fetchData = async (completed) => {
    const res = await fetch("http://localhost:5000/contests?completed=" + completed + "&user_id=1");
    const json = await res.json();
    setData(json)
  }

  useEffect(() => {
    fetchData("False");
    }, []
  )

  return (
    <Fragment>
      <Grid container justify="center" alignItems="center" className={classes.container}>
        <Grid item xs={12}>
          <ButtonGroup fullWidth>
            <Button
              variant="text"
              className={(tab === 0) ? classes.buttonSelected : classes.buttonUnselected}
              onClick={() => {fetchData("False"); setTab(0)}}
            >IN PROGRESS</Button>
            <Button
              variant="text"
              className={(tab === 1) ? classes.buttonSelected : classes.buttonUnselected}
              onClick={() => {fetchData("True"); setTab(1)}}
            >COMPLETED</Button>
          </ButtonGroup>
        </Grid>
        <Paper className={classes.paper}>
          {data.map(contest => (
            <ProfileSubmission
              image={contest.image}
              title={contest.title}
              description={contest.description}
              prizeAmount={contest.prize}
            />
          ))}
        </Paper>
      </Grid>
    </Fragment>
  )
}

