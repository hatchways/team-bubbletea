import React, { Fragment } from 'react';
import { makeStyles, TextField, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    "margin-top": 5,
    "margin-bottom" : 5,
    width: 300,
  },
  caption: {
  	"color": theme.default,
  }
}));

export function BasicTextField(props) {
  const classes = useStyles();

return(
	<Fragment>
		<Grid item>
			<Typography variant="caption" className={classes.caption}>
				{props.label}
			</Typography>
		</Grid>
		<Grid item>
			<TextField
				type={props.type} 
				className={classes.root}
				variant="outlined" 
				onChange={props.onChange} 
				value={props.value}
			/>
		</Grid>
	</Fragment>
	)
}