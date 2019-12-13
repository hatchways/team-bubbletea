from flask import Blueprint, jsonify, request 
from database import db
from web_socket import socketio
from models import Message, User, Conversation 
from datetime import datetime 
import jwt

message_handler = Blueprint(
    'message_handler', __name__
)

@message_handler.route('/create', methods=['POST'])
def create(): 
    message_parameters = request.get_json()
    encoded_token = message_parameters['jwtoken'] 
    decoded_token = jwt.decode(encoded_token, 'secret', algorithm='HS256')
    from_user = User.query.get_or_404(decoded_token['sub'])
    conversation = Conversation.query.get_or_404(message_parameters['conversation_id'])
    users = conversation.users
    for user in users: 
        if user.id == from_user.id: 
            filter(lambda user: user.id != from_user.id, users)
            message = Message(conversation_id=message_parameters['conversation_id'], 
                            message_text=message_parameters['message_text'], 
                            from_user=from_user, 
                            to_user=users[0]) 
            db.session.add(message)
            db.session.commit()
            socketio.emit('message sent', message.to_dict(), room=message.conversation_id)
            return jsonify({ "success": True })
    return jsonify({ "error": "This user is not allowed to modify the conversation."})


