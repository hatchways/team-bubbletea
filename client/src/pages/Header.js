import React from "react";
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(5),
    fontFamily: theme.fontFamily,
    letterSpacing: "0.3em",
  },
  AppBar: {
    backgroundColor: "black",
    padding: "15px 0"
  }
}));

export function Header(props) {
  const classes = useStyles();

  return (
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