from flask import Blueprint, jsonify, request
from database import db
from models import User
import json

signup_handler = Blueprint('signup_handler', __name__)

@signup_handler.route('', methods=['POST'])
def signup():
    result = ''
    user = request.get_json()

    # Validation for password length; validation for email format done client-side
    if len(user['password']) < 6:
        result = "Password must have a minimum of 6 characters!"
        return jsonify(result=result)

    new_user = User(email=user['email'],
                    password=user['password'])
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except:
        result = "Email already registered!"
    
    return jsonify(result="Successfully registered!")