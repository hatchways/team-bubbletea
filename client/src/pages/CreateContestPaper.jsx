import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { TextFieldLarge } from './TextFieldLarge';
import { TextFieldPrizeAmount } from './TextFieldPrizeAmount';
import { CreateContestPickDesign } from './CreateContestPickDesign';
import { CreateContestButton } from './CreateContestButton';
import { CreateContestDatePicker } from './CreateContestDatePicker';

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prizeAmount, setPrizeAmount] = useState(100.00);
  const [deadline, setDeadline] = useState(new Date());

  const handleCreateContest = (e) => {
    fetch('http://localhost:5000/contests', { // POST request to backend
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "title": title,
        "description": description,
        "prize": prizeAmount,
        "deadline": format(deadline, 'MM/dd/yyyy, HH:mm')
      })
    })
  }

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
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <TextFieldLarge
            label="Description"
            placeholder="Details about what type of tattoo you want"
            rows="10"
            rowsMax="10"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextFieldPrizeAmount
                label="Prize amount"
                placeholder="$100.00"
                value={prizeAmount}
                onChange={e => setPrizeAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={8}>
              <CreateContestDatePicker
                deadline={deadline}
                setDeadline={setDeadline}
              />
            </Grid>
          </Grid>
          <CreateContestPickDesign />
          <CreateContestButton
            onClick={handleCreateContest}
          />
        </Paper>
      </Grid>
    </>
  )
}