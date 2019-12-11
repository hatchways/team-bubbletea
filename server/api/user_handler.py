from flask import Blueprint, jsonify, request 
from database import db
from models import User 
from datetime import datetime 
import jwt

user_handler = Blueprint('user_handler', __name__)

@user_handler.route('/show', methods=['POST'])
def show_all():
    jwt_token = request.get_json()['jwtoken'] 
    token = jwt.decode(jwt_token, 'secret', algorithm='HS256') 
    user_logged_in = User.query.get_or_404(token['sub']) 
    other_users = User.query.filter(User.id != user_logged_in.id)
    users_dict = jsonify({'other_users': [user.to_dict() for user in other_users], 'user_logged_in': user_logged_in.to_dict()})
    return users_dict
