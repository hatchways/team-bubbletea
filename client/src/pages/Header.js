import React from "react";
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  title: {
    width: "100%",
    flexGrow: 1,
    marginLeft: theme.spacing(5),
    fontFamily: theme.fontFamily,
    letterSpacing: "0.3em",
  },
  AppBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "black"
  }
}));

export function Header(props) {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed" className={classes.AppBar}>
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