from flask import Blueprint, jsonify, request
import jwt
from database import db
from models import Conversation, User 
from datetime import datetime 

conversation_handler = Blueprint(
  'conversation_handler', __name__
)

@conversation_handler.route('/create', methods=['POST'])
def new():
  conversation_parameters = request.get_json() 
  user_one = User.query.get_or_404(conversation_parameters['user_id'])
  token = jwt.decode(conversation_parameters['jwtoken'], 'secret', algorithm='HS256')
  user_two = User.query.get_or_404(token['sub']) 
  filtered_conversations = Conversation.query.filter(Conversation.users.contains(user_one), Conversation.users.contains(user_two))
  if filtered_conversations.count() == 0:
    conversation = Conversation(users=[user_one, user_two])
    db.session.add(conversation)
    db.session.commit()
    return jsonify({ "success": True })
  else:
    return jsonify({ "error": "The conversation you are trying to create already exists!"})

@conversation_handler.route('/show', methods=['POST'])
def show_all_conversations():
  encoded_token = request.get_json()['jwtoken']
  decoded_token = jwt.decode(encoded_token, 'secret', algorithm='HS256')
  conversation_user = User.query.get_or_404(decoded_token['sub'])
  conversations = Conversation.query.filter(Conversation.users.contains(conversation_user))
  conversation_dicts = jsonify([conversation.to_dict() for conversation in conversations])
  return conversation_dicts

@conversation_handler.route('/<int:conversation_id>/messages', methods=['GET'])
def show_all_messages(conversation_id):
  conversation = Conversation.query.get_or_404(conversation_id) 
  message_dicts = jsonify([message.to_dict() for message in conversation.messages])
  return message_dicts

# { 'jwtoken' : '' encrypted token, 
#   'user_id' : int }