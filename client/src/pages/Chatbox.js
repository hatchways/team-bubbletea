import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Grid from "@material-ui/core/Grid"
import { Typography } from "@material-ui/core";
import { Input } from "@material-ui/core";

const styles = theme => ({
  root: {
    position: 'fixed',
    marginLeft: theme.spacing(35), 
    marginTop: theme.spacing(65),
  },
  textbox: {
    width: 900
  },
  toolbar: theme.mixins.toolbar
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
      <main>
        {this.props.messages.map(convMessage => {
          return (
            <Typography paragraph>
              <div key={convMessage.message_id}>
                {convMessage.from_user.first_name + ':'}
                {convMessage.message_text}
              </div>
            </Typography>
          )
        }
        )}
        <Grid container className={classes.root}>
          <Grid item className={classes.textbox}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Type a message..."
              onChange={this.handleInputChange}
              value={this.state.inputMessage}
            />
          </Grid>
          <Grid item>
            <div onClick={this.sendMessage}>
              <Fab color="primary" aria-label="send" size="small">
                <SendIcon />
              </Fab>
            </div>
          </Grid>
          </Grid>
      </main>
    )
  }
}

Chatbox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Chatbox); 