import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid"
import { Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  textBoxContainer: {
    width: 1040,
    marginLeft: theme.spacing(30),
    height: 95,
    boxShadow: "0px 1px 5px 0px rgba(209, 209, 209, 0.9)"
  },
  textBox: {
    paddingTop: theme.spacing(2.5),
    paddingLeft: theme.spacing(3.5),
    width: 940,
  },
  sendButton: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2), 
  },
}));

export function MessageSendField(props) {
  const classes = useStyles();

  return (
    <div className={classes.textBoxContainer}>
      <Grid container direction="row" alignItems="center">
        <Grid item className={classes.textBox}>
          <TextField
            fullWidth
            name="inputMessage"
            id="outlined-basic"
            variant="outlined"
            label="Type a message..."
            onChange={props.onMessageChange}
            value={props.onValueChange}
          />
        </Grid>
        <Grid item className={classes.sendButton}>
          <Button variant="contained" size="medium" color="primary" onClick={props.onClickSendButton}>
            Send
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}
