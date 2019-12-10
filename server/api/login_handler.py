from flask import render_template, Blueprint, session, jsonify, request
import json
import jwt
import datetime

login_handler = Blueprint('login_handler', __name__)


# Loading sample_users.json as a very simple "database"
with open('sample_users.json') as sample_users:
    users = json.load(sample_users)


# Check if user is in our json "database" and return true if password matches
# ***** Needs to be changed once actual db is set up *****
def authenticate(email, password):
    filtered_users = [x for x in users if (x['email'] == email)]
    if not filtered_users:
        return False

    return filtered_users[0]['password'] == password


# Decode JWT token and return email, secret key to another variable later
def decode(encoded):
    decoded = jwt.decode(encoded, 'secret', algorithm='HS256')

    return decoded['sub']


# Routes
@login_handler.route('')
def home():

    logged_in = False

    if 'token' in session:
        decoded = decode(session['token'])
        logged_in = True

    return render_template('home.html', logged_in=logged_in, email=decoded)


@login_handler.route('', methods=['POST'])
def login():

    error = ''

    user = request.get_json()

    if authenticate(user['email'], user['password']):
        token = jwt.encode(
            {
                'sub': user['email'],
                'iat': datetime.datetime.utcnow(),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1)
            },
            'secret', algorithm='HS256'  # Change secret key in config.py later
        )
        return jsonify(token=token.decode('utf-8'), error=error)
    else:
        error = 'Invalid credentials'

    return jsonify(error=error)
