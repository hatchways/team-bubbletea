from flask import Blueprint, jsonify 
from database import db
from models import User 
from datetime import datetime 

user_handler = Blueprint('user_handler', __name__)

@user_handler.route('/show')
def show_all():
    users = User.query.all()
    users_dict = jsonify([user.to_dict() for user in users])
    return users_dict