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
            <Button color="default" className={classes.winnerButton}>
              Declare Winner
                </Button>
            <Button color="default" onClick={props.closePopUp} >
              Close
                </Button>
          </DialogActions>
        </Dialog>
      </ClickAwayListener>
    </div>
  );
}