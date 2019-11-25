import React from "react"; 
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    "margin-left": "3.5%",
    "font-family": theme.fontFamily,
    "letter-spacing": "0.3em",
  },
  AppBar: {
  	"background-color" : theme.secondary, 
  }
}));

export function Header(props) {
	const classes = useStyles();

 	return(
	 <div>
      <AppBar position="static" className={classes.AppBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            TATTOO ART
          </Typography>
         {props.children}
        </Toolbar>
      </AppBar>
    </div>
    )
  }