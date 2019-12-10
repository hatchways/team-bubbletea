import React from 'react';
import { makeStyles, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, ClickAwayListener } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  winnerButton: {
    position: 'relative',
  }
}));

export function ImagePopUp(props) {
  const classes = useStyles();

  function declareWinner() {
    (async () => {
      const response = await fetch(`contests/${props.contestID}/submissions/winner`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submission_id: props.submissionID })
      });
    })();

    props.closePopUp();
    props.openWinnerMsg();
  }

  return (
    <div>
      <ClickAwayListener onClickAway={props.closePopUp}>
        <Dialog open={props.imagePopUpDisplayed}>
          <DialogTitle>
            <Typography variant="overline">
              Submitted by: /artistname/
                </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <img width="100%" height="100%" src={props.imageURL} alt="submission-popup" />
          </DialogContent>
          <DialogActions>
            {!props.winnerDeclared && <Button color="default" className={classes.winnerButton} onClick={declareWinner}>
              Declare Winner
                </Button>}
            <Button color="default" onClick={props.openWinnerMsg} >
              Close
                </Button>
          </DialogActions>
        </Dialog>
      </ClickAwayListener>
    </div>
  );
}