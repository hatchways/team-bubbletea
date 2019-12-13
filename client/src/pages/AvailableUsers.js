import React from "react";
import { Dialog } from "@material-ui/core";
import { DialogTitle } from "@material-ui/core";
import { List } from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import { ListItemText } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { ListItemAvatar } from "@material-ui/core";
import { Avatar } from "@material-ui/core";

export function AvailableUsers(props) {
  return (
    <Dialog onClose={props.closeUsersPopUp} aria-labelledby="dialog-title" open={props.viewUsers}>
      <DialogTitle id="dialog-title">
        <Typography variant="h6">
          Select New Chat
        </Typography>
      </DialogTitle>
      <List>
        {props.users.other_users.map((user) => (
          <ListItem button onClick={() => props.onUserClick(user.user_id)} key={user.user_id}>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText primary={user.first_name + ' ' + user.last_name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}