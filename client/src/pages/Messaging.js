import React from "react";
import openSocket from "socket.io-client";
import { AvailableUsers } from "./AvailableUsers";
import { ConversationsList } from "./ConversationsList";
import Chatbox from "./Chatbox";
import { Header } from "./Header";

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
    this.onUserClick = this.onUserClick.bind(this)
    this.onCloseUsersPopUp = this.onCloseUsersPopUp.bind(this)
  }

  componentDidMount() {
    fetch('/users/show', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({ 'jwtoken': localStorage.getItem('token')})
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        this.setState({ users: response })
      })
      .catch(error => {
        console.log(error)
      })
    this.loadConversations() 
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

  loadConversations() {
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
  }

  viewAvailableUsers() {
    this.setState({ viewUsers: true })
  }

  onUserClick(userID) {
    this.setState({ viewUsers: false })
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
    .then(this.loadConversations())
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

  onCloseUsersPopUp() {
    this.setState({ viewUsers: false })
  }

  render() {
    return (
      <div>
        <Header />
        {this.state.viewUsers &&
          <AvailableUsers
            closeUsersPopUp={this.onCloseUsersPopUp}
            viewUsers={this.state.viewUsers}
            users={this.state.users}
            onUserClick={this.onUserClick}
          />}
        <ConversationsList
          userLoggedIn={this.state.users.user_logged_in}
          viewAvailableUsers={this.viewAvailableUsers}
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