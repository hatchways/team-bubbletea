import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Grid } from "@material-ui/core";
import { BackToContestsListButton } from "./BackToContestsListsButton";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: null,
    paddingBottom: theme.spacing(1), 
    paddingLeft: theme.spacing(15)
  }
}));

export function ContestDetailsPaperSheet() {
  const classes = useStyles();

  return (
    <Grid container justify="center">
      <Grid item xs={9} md={7} lg={12}>
        <Paper className={classes.root}>
          <BackToContestsListButton />
          <div>
            <Typography variant="h4">Contest Title</Typography>
            <Typography variant="h6">$150</Typography>
          </div>
          <Typography variant="caption">Author name</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
