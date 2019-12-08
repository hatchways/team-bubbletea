from flask import Blueprint, jsonify, request, session, render_template
from database import db
from models import User
from datetime import datetime
import jwt

user_handler = Blueprint('user_handler', __name__)


@user_handler.route('/show')
def show_all():
    users = User.query.all()
    users_dict = jsonify([user.to_dict() for user in users])
    return users_dict

# [{}]

# {'other_users': [{}], 'user_logged_in': {}}


def authenticate(email, password):
    filtered_user = db.session.query(User).filter(User.email == email).first()
    if not filtered_user:
        return False
    return filtered_user.check_password(password), filtered_user


# Decode JWT token and return email, secret key to another variable later
def decode(encoded):
    decoded = jwt.decode(encoded, 'secret', algorithm='HS256')

    return decoded['sub']


# Routes
@user_handler.route('/home')
def home():

    logged_in = False

    if 'token' in session:
        decoded = decode(session['token'])
        logged_in = True

    return render_template('home.html', logged_in=logged_in, email=decoded)


@user_handler.route('/login', methods=['POST'])
def login():

    error = ''

    user = request.get_json()

    auth_bool, user_from_db = authenticate(user['email'], user['password'])

    if auth_bool:
        token = jwt.encode(
            {
                'sub': user_from_db.id,
                'iat': datetime.datetime.utcnow(),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=24*60)
            },
            'secret', algorithm='HS256'  # Change secret key in config.py later
        )
        return jsonify(token=token.decode('utf-8'), error=error)
    else:
        error = 'Invalid credentials'

    return jsonify(error=error)
