import React, { Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { StartNewChatButton } from "./StartNewChatButton";
import { ListItemAvatar } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  listTitle: {
    marginTop: theme.spacing(2)
  },
  newChatButton: {
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  toolBar: theme.mixins.toolbar,
}))

export function ConversationsList(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.toolBar} />
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item className={classes.listTitle}>
            <Typography variant="h6">
              Inbox Messages
          </Typography>
          </Grid>
          <Grid className={classes.newChatButton}>
            <StartNewChatButton
              viewAvailableUsers={props.viewAvailableUsers}
            />
          </Grid>
        </Grid>
        <List>
          {props.conversations.map((conversation) => (
            <Fragment>
              <ListItem button onClick={() => props.onConversationClick(conversation.conversation_id)}
                key={conversation.conversation_id}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography variant="subtitle2">
                      {conversation.users.map((user) => user.user_id !== props.userLoggedIn.user_id ? user.first_name + ' ' + user.last_name : null)}
                    </Typography>}
                />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </Drawer>
    </div>
  )
}
