import React, { useState }from 'react';
import { makeStyles, Typography, Grid } from '@material-ui/core';
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';
import { format } from 'date-fns';

const useStyles = makeStyles(theme => ({
	root: {
		width: "80%",
	},
	caption: {
		color: "#000000",
		margin: "10px 0",
		fontWeight: 600,
	},
	textfield: {
		width: "100%",
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(5),
		"& fieldset": {
			borderRadius: 0,
		},
  },
  inputProps: {
		padding: "30px",
	}
}));

export function CreateContestDatePicker(props) {
  const classes = useStyles();

  return (
    <Grid container justify="center">
      <Grid item xs={12}>
				<Typography align="left" variant="h5" className={classes.caption}>
					Deadline
					{/* {format(props.deadline, 'dd/MM/yyyy HH:mm')} */}
				</Typography>
			</Grid>
      <Grid item xs={4}>
        <KeyboardDatePicker
					value={props.deadline}
					className={classes.textfield}
					InputAdornmentProps={{ position: "end" }}
					inputProps={{className: classes.inputProps}}
					variant="inline"
					inputVariant="outlined"
          format="dd/MM/yyyy"
          onChange={props.setDeadline}
          animateYearScrolling
        />
			</Grid>
      <Grid item xs={4}>
				<TimePicker
					value={props.deadline}
					className={classes.textfield}
					inputProps={{className: classes.inputProps}}
					variant="inline"
					inputVariant="outlined"
          onChange={props.setDeadline}
        />
			</Grid>
      <Grid item xs={4}>
			</Grid>
    </Grid>
  )
}