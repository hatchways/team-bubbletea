import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import { ImagesGrid } from './ImagesGrid';

const useStyles = makeStyles(theme => ({
  paper: {
    "margin-top": "1%",
    "margin-bottom": "1%",
    "box-shadow" : 
    "0px 2px 5px 1px rgba(209, 209, 209, 0.9), 0px 2px 5px -1px rgba(209, 209, 209, 0.9), 0px 2px 5px 1px rgba(209, 209, 209, 0.9), 0px 2px 5px 1px rgba(209, 209, 209, 0.9)",
    "padding-bottom": "1%" 
  },
}));

export function ImageDisplayPaper(props) {
  const classes = useStyles();

  return (
  <Grid container justify="center">
    <Grid item xs={9} md={7} lg={10} className={classes.position}>
      <Paper className={classes.paper}>
          <Grid item>
            <ImagesGrid 
              imageClickHandler={props.imageClickHandler} 
              submissions={props.submissions} 
              submissionKeys={props.submissionKeys}/>
          </Grid>
      </Paper>
    </Grid>
  </Grid>
  );
}