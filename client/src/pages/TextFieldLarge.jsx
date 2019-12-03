import React, { Fragment } from 'react';
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
		marginBottom: theme.spacing(8),
		"& fieldset": {
      borderRadius: 0,
    },
	}
}));

export function TextFieldLarge(props) {
  const classes = useStyles();

return (
	<Fragment>
		<Grid container justify="center">
			<Grid item xs={12}>
				<Typography align="left" variant="h5" className={classes.caption}>
					{props.label}
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<TextField
					type={props.type} 
					className={classes.textfield}
					variant="outlined" 
					onChange={props.onChange} 
					value={props.value}
					placeholder={props.placeholder}
					multiline
					rows={props.rows}
					rowsMax={props.rowsMax}
				/>
			</Grid>
		</Grid>
	</Fragment>
	)
}