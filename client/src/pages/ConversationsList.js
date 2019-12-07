import React from "react";

export function ConversationsList(props) {
  return (
    <div>Conversations
      <ul>
        {props.conversations.map((conversation) => (
          <li onClick={() => props.onConversationClick(conversation.conversation_id)}
            key={conversation.conversation_id}>
            {conversation.users.map((user) => user.first_name + ' ' + user.last_name)}
          </li>
        ))}
      </ul>
    </div>
  )
}