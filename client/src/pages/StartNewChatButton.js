import React from "react";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export function StartNewChatButton(props) {
  return (
    <div onClick={props.viewAvailableUsers}>
      <Fab size="small" color="primary">
        <AddIcon />
      </Fab>
    </div>
  )
}