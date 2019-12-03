import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import { TextFieldLarge } from './TextFieldLarge';
import { TextFieldPrizeAmount } from './TextFieldPrizeAmount';
import { CreateContestPickDesign } from './CreateContestPickDesign';
import { CreateContestButton } from './CreateContestButton';

const useStyles = makeStyles(theme => ({
  paper: {
    width: "50%",
    padding: "5%",
    margin: "5% 0",
    boxShadow:
      "-5px -5px 10px 3px rgba(209, 209, 209, 0.15), 5px 5px 10px 3px rgba(209, 209, 209, 0.15)"
  },
  header: {
    fontWeight: 600,
    marginTop: "5%",
  }
}));

export function CreateContestPaper(props) {
  const classes = useStyles();

  return (
    <>
    <Typography align="center" variant="h4" className={classes.header}>
			Create new contest
		</Typography>
    <Grid container justify="center">
      <Paper className={classes.paper}>
        <TextFieldLarge
          label="What do you need designed?"
          placeholder="Write a descriptive contest title"
          rowsMax="1"
        />
        <TextFieldLarge
          label="Description"
          placeholder="Details about what type of tattoo you want"
          rows="10"
          rowsMax="10"
        />
        <Grid container>
          <Grid item xs={4}>
            <TextFieldPrizeAmount
              label="Prize amount"
              placeholder="$100.00"
            />
          </Grid>
        </Grid>
        <CreateContestPickDesign />
        <CreateContestButton />
      </Paper>
    </Grid>
    </>
  )
}