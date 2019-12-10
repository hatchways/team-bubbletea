import React from 'react';
import { makeStyles, TextField, Typography, Grid } from '@material-ui/core';

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

export function TextFieldPrizeAmount(props) {
	const classes = useStyles();

	return (
		<Grid container justify="center">
			<Grid item xs={12}>
				<Typography align="left" variant="h5" className={classes.caption}>
					{props.label}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<TextField
					type="number"
					className={classes.textfield}
					inputProps={{className: classes.inputProps}}
					variant="outlined"
					onChange={props.onChange}
					value={props.value}
					placeholder={props.placeholder}
				/>
			</Grid>
		</Grid>
	)
}