from flask import Blueprint, jsonify, request
from database import db
from models import User
import json
import re

signup_handler = Blueprint('signup_handler', __name__)

@signup_handler.route('', methods=['POST'])
def signup():
    result = ''
    user = request.get_json()

    # Validation for email, regex from emailregex.com
    if re.fullmatch(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", user['email']) == None:
        result = "Invalid email!"
        return jsonify(result=result)
    # Validation for password length
    if len(user['password']) < 6:
        result = "Password must have a minimum of 6 characters!"
        return jsonify(result=result)

    new_user = User(email=user['email'])
    new_user.password = user['password'] 
    
    try:
        db.session.add(new_user)
        db.session.commit()
        result = "Successfully registered"
    except:
        result = "Email already registered!"
    
    return jsonify(result=result)