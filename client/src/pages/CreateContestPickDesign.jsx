import React, { useState, Fragment, useEffect } from 'react';
import { makeStyles, TextField, Typography, Grid } from '@material-ui/core';
import { InspDesign } from './InspDesign';

const useStyles = makeStyles(theme => ({
  root: {
    width: "80%",
  },
  caption: {
    color: "#000000",
    margin: "10px 0",
    fontWeight: 600,
  },
  container: {
    border: "1px solid rgba(0, 0, 0, 0.2)",
    height: "500px",
    margin: "50px 0",
    padding: "30px",
    overflow: "auto"
  }
}));

// Placeholder array for image URLs, implement to fetch from bucket after
let designsArray = [];
let i;
for (i = 1; i <= 11; i++) {
  designsArray.push('/designs/design' + i + '.png')
};

export function CreateContestPickDesign(props) {
  const [designs] = useState(designsArray);
  const classes = useStyles();

  console.log(designsArray)
  return (
    <Fragment>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography align="left" variant="h5" className={classes.caption}>
            Which designs do you like?
          </Typography>
          <Typography align="left">
            Let's start by helping your designers understand which style you prefer.
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.container}>
          <Grid container spacing={2} justify="center">
            {designs.map((design, j) => ( <InspDesign imageURL={designs[j]} /> ))}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}