import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import HomePageContest from "./HomePageContest";

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
  },
  subHeading: {
    fontWeight: 600,
    marginBottom: 30
  }
}));

export function HomePagePaper() {
  const classes = useStyles();
  const [inProgressData, setInProgressData] = useState([]);
  const [completedData, setCompletedData] = useState([]);

  const fetchInProgressData = async () => {
    const res = await fetch("http://localhost:5000/contests?completed=False");
    const json = await res.json();
    setInProgressData(json);
  }

  const fetchCompletedData = async () => {
    const res = await fetch("http://localhost:5000/contests?completed=True");
    const json = await res.json();
    setCompletedData(json);
  }

  useEffect(() => {
    fetchInProgressData();
    fetchCompletedData();
    }, []
  )

  return (
    <Fragment>
      <Grid container justify="center" alignItems="center" className={classes.container}>
        <Paper className={classes.paper}>
          <Typography variant="h5" className={classes.subHeading}>Currently running</Typography>
          <Grid container>
            {inProgressData.map(contest => (
            <HomePageContest
              image={contest.image}
              title={contest.title}
              description={contest.description}
              prizeAmount={contest.prize}
            />
          ))}
          </Grid>
          <Typography variant="h5" className={classes.subHeading}>Past Contests</Typography>
          <Grid container>
            {completedData.map(contest => (
            <HomePageContest
              image={contest.image}
              title={contest.title}
              description={contest.description}
              prizeAmount={contest.prize}
            />
          ))}
          </Grid>
        </Paper>
      </Grid>
    </Fragment>
  )
}

