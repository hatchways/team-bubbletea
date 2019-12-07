import React from "react";

export class Chatbox extends React.Component {
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
    this.setState({ inputMessage: ''}) 
  }

  render() {
    return (
      <div className='chatBox'>
        {this.props.messages.map(convMessage => {
          return (
            <div key={convMessage.message_id}>
              {convMessage.from_user.first_name + ':'}
              {convMessage.message_text}
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