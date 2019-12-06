import React, { useState }from 'react';
import { makeStyles, Typography, Grid } from '@material-ui/core';
import { KeyboardDatePicker, TimePicker } from '@material-ui/pickers';

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
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <Grid container justify="center">
      <Grid item xs={12}>
				<Typography align="left" variant="h5" className={classes.caption}>
					Deadline
				</Typography>
			</Grid>
      <Grid item xs={4}>
        <KeyboardDatePicker
					value={selectedDate}
					className={classes.textfield}
					InputAdornmentProps={{ position: "end" }}
					inputProps={{className: classes.inputProps}}
					variant="inline"
					inputVariant="outlined"
          format="dd/MM/yyyy"
          onChange={handleDateChange}
          animateYearScrolling
        />
			</Grid>
      <Grid item xs={4}>
				<TimePicker
					value={selectedDate}
					className={classes.textfield}
					inputProps={{className: classes.inputProps}}
					variant="inline"
					inputVariant="outlined"
          onChange={handleDateChange}
        />
			</Grid>
      <Grid item xs={4}>
			</Grid>
    </Grid>
  )
}