import React from "react";
import openSocket from "socket.io-client";

export class Chatbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversation: [],
      inputMessage: ''
    };
    this.socket = openSocket('http://localhost:5000');
    this.handleInputChange = this.handleInputChange.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }
  componentDidMount() {
    this.socket.on('ack', response => {
      this.setState(previousState => {
        let previousConversation = JSON.parse(JSON.stringify(previousState.conversation))
        previousConversation.push({ from: "user1", test: response })
        return { conversation: previousConversation }
      });
    })

    // this will be used to handle the second user's response after schema is added 
    // i.e. when we can distinguish between 2 users
    // is not being used currently 
    this.socket.on('incoming response', response => {
      this.setState(previousState => {
        let previousConversation = JSON.parse(JSON.stringify(previousState.conversation))
        previousConversation.push({ from: "user2", test: response })
        return { conversation: previousConversation }
      });
    })
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  sendMessage() {
    this.socket.emit('incoming message', this.state.inputMessage)
  }

  render() {
    return (
      <div className='chatBox'>
        {this.state.conversation.map(convMessage => {
          return (
            <div className={convMessage.from === "user1" ? "user1Message" : "user2Message"}>
              {convMessage.test}
            </div>
          )
        }
        )}
        <input
          type='text'
          name='inputMessage'
          onChange={this.handleInputChange}
          value={this.state.inputMessage}
        />
        <input
          type='button'
          onClick={this.sendMessage}
          value={'Send Message'}
        />
      </div>
    )
  }
}