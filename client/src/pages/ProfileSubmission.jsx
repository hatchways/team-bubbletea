import React, { useState, Fragment } from 'react';
import { makeStyles, Typography, Grid, Button } from '@material-ui/core';
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: "25px"
  },
  image: {
    height: "250px",
    width: "250px",
    objectFit: "cover"
  },
  title: {
    fontWeight: "600",
    marginTop: "20px",
    marginBottom: "10px"
  },
  description: {
    color: "gray",
  },
  button: {
    borderRadius: "0px",
    backgroundColor: "black",
    color: "white",
    marginTop: "30px"
  }
}));

export default function ProfileSubmission(props) {
  const [image] = useState(props.image);
  const [title] = useState(props.title);
  const [description] = useState(props.description);
  const [prizeAmount] = useState(props.prizeAmount);
  const [contestID] = useState(props.contestID);
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container spacing={3} className={classes.container}>
        <Grid item xs={3}>
          <img src={image} alt="" className={classes.image}></img>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h5" className={classes.title}>{title}</Typography>
          <Typography className={classes.description}>{description}</Typography>
          <Button className={classes.button}>{'$' + prizeAmount}</Button>
          <Grid item><Link to={`/view-submissions/${contestID}`}>Go to Contest</Link></Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}