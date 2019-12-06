import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid } from '@material-ui/core';
import { ImagesGrid } from './ImagesGrid';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2),
    boxShadow:
      "0px 2px 5px 1px rgba(209, 209, 209, 0.9), 0px 2px 5px -1px rgba(209, 209, 209, 0.9), 0px 2px 5px 1px rgba(209, 209, 209, 0.9), 0px 2px 5px 1px rgba(209, 209, 209, 0.9)"
  },
}));

export function ImageDisplayPaper(props) {
  const classes = useStyles();

  return (
    <Grid container justify="center">
      <Grid item xs={9} md={7} lg={10}>
        <Paper className={classes.paper}>
          <Grid item>
            <ImagesGrid
              imageClickHandler={props.imageClickHandler}
              submissions={props.submissions}
              submissionKeys={props.submissionKeys}
              submissionIDs={props.submissionIDs} />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}