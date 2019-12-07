import React from "react";
import openSocket from "socket.io-client";
import { AvailableUsers } from "./AvailableUsers";
import { ConversationsList } from "./ConversationsList";
import { Chatbox } from "./Chatbox";

export class Messaging extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      viewUsers: false,
      conversations: [],
      conversationClickedID: null,
      messages: []
    };
    this.socket = openSocket('http://localhost:5000');
    this.viewAvailableUsers = this.viewAvailableUsers.bind(this)
    this.onConversationClick = this.onConversationClick.bind(this)
    this.onMessageSent = this.onMessageSent.bind(this)
  }

  componentDidMount() {
    fetch('/users/show', { method: 'GET' })
      .then(response => response.json())
      .then(response => {
        this.setState({ users: response })
      })
      .catch(error => {
        console.log(error)
      })

    fetch('/conversations/show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'jwtoken': localStorage.getItem('token') })
    })
      .then(response => response.json())
      .then(response => {
        this.setState({ conversations: response })
      })
      .catch(error => {
        console.log(error)
      })
    //TODO add message listener to update the messages state 
    this.socket.on('message sent', (incomingMessage) => {
      if (incomingMessage.conversation_id === this.state.conversationClickedID) {
        this.setState(previousState => {
          let previousMessages = JSON.parse(JSON.stringify(previousState.messages))
          previousMessages.push(incomingMessage)
          return { messages: previousMessages }
        })
      }
    })
  }

  viewAvailableUsers() {
    this.setState({ viewUsers: true })
  }

  onUserClick(userID) {
    const conversationPayload = {
      'jwtoken': localStorage.getItem('token'),
      'user_id': userID
    }
    fetch('/conversations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(conversationPayload)
    })
    //    .then(response => {
    //      console.log(response.json())
    //    })
  }

  onConversationClick(conversationID) {
    fetch('/conversations/' + conversationID + '/messages', { method: 'GET' })
      .then(response => response.json())
      .then(response => (
        this.setState({ messages: response })
      ))
      .catch(error => {
        console.log(error)
      })
    this.setState({ conversationClickedID: conversationID })
    this.socket.emit('join room', conversationID)
  }

  onMessageSent(messageText) {
    const messagePayload = {
      'jwtoken': localStorage.getItem('token'),
      'conversation_id': this.state.conversationClickedID,
      'message_text': messageText
    }

    fetch('/messages/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messagePayload)
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
      })
  }

  render() {
    return (
      <div>
        <input
          type="button"
          onClick={this.viewAvailableUsers}
          value={'Start New Chat'} />
        {this.state.viewUsers &&
          <AvailableUsers
            users={this.state.users}
            onUserClick={this.onUserClick}
          />}
        <ConversationsList
          conversations={this.state.conversations}
          onConversationClick={this.onConversationClick}
        />
        <Chatbox
          messages={this.state.messages}
          onMessageSent={this.onMessageSent}
        />
      </div>
    )
  }
}