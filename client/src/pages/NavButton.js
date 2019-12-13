import React from "react";
import { makeStyles, Button, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  title: {
    fontFamily: theme.fontFamily,
    fontSize: 10,
    padding: 5
  }
}));

export function NavButton(props) {
  const classes = useStyles();

  return (
    <Button color="inherit" className={classes.button} onClick={ () => props.redirect(props.buttonName)}>
      <Typography className={classes.title} variant="button">
        {props.buttonName}
      </Typography>
    </Button>
  );
}