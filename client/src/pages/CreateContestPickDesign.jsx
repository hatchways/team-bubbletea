import React, { useState, Fragment } from 'react';
import { makeStyles, Typography, Grid } from '@material-ui/core';
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
let designsArray = ["https://i.imgur.com/jbOoUbr.png", "https://i.imgur.com/uYZX8sA.png",
"https://i.imgur.com/x47vWz3.png", "https://i.imgur.com/b1g6Vzv.png", "https://i.imgur.com/N5nuDoC.png",
"https://i.imgur.com/9V2l7vZ.png", "https://i.imgur.com/EJ1PCA9.png", "https://i.imgur.com/b6qWOXx.png",
"https://i.imgur.com/BrYdOxi.png", "https://i.imgur.com/iUUALda.png", "https://i.imgur.com/Q1Yp07G.png"];
// let i;
// for (i = 1; i <= 11; i++) {
//   designsArray.push('/designs/design' + i + '.png')
// };

export function CreateContestPickDesign(props) {
  const [designs] = useState(designsArray);
  const [selected, setSelected] = useState("");
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography align="left" variant="h5" className={classes.caption}>
            Which designs do you like?
          </Typography>
          {/* <p>{selected}</p> */}
          <Typography align="left">
            Let's start by helping your designers understand which style you prefer.
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.container}>
          <Grid container spacing={2} justify="center">
            {designs.map((design, j) => (<InspDesign onClick={() => setSelected(designs[j])} imageURL={designs[j]} />))}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}