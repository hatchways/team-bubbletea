import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid"
import { Typography, Avatar } from "@material-ui/core";
import { MessageSendField } from "./MessageSendField";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
  messagesContainer: {
    backgroundColor: "#f6f6f6",
    height: 450,
    width: 1040,
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(30),
    "overflow-y": "auto", 
    "overflow-x": "hidden"
  },
  messages: {
    marginLeft: theme.spacing(3),
    paddingTop: theme.spacing(1), 
    paddingBottom: theme.spacing(1)
  }, 
  messageCard: {
    height: 50, 
    borderRadius: 25
  }, 
  messageText: {
    marginBottom: theme.spacing(10)
  }
});

class Chatbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputMessage: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  sendMessage() {
    this.props.onMessageSent(this.state.inputMessage)
    this.setState({ inputMessage: '' })
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid container className={classes.messagesContainer}>
          {this.props.messages.map(convMessage => {
            return (
              <Grid container direction="row" spacing={1} alignItems="center" className={classes.messages}>
                <Grid item alignContent="center">
                  <Avatar className={classes.avatar} />
                </Grid>
                <Grid item alignContent="center" justify="center">
                  <Card className={classes.messageCard}>
                    <CardContent>
                      <Typography adisplay="inline" variant="subtitle2" className={classes.messageText}>
                        <div key={convMessage.message_id}>
                          {convMessage.from_user.first_name + ":" + " "}
                          {convMessage.message_text}
                        </div>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )
          }
          )}
        </Grid>
        <MessageSendField
          onMessageChange={this.handleInputChange}
          onValueChange={this.state.inputMessage}
          onClickSendButton={this.sendMessage}
        />
      </Fragment>
    )
  }
}

Chatbox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Chatbox); 