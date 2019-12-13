from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_cors import CORS
from flask_socketio import join_room, send
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.signup_handler import signup_handler
from api.contest_handler import contest_handler
from api.submission_handler import submission_handler
from api.payment_handler import payment_handler
from api.user_handler import user_handler
from api.conversation_handler import conversation_handler
from api.message_handler import message_handler
from api.oauth_handler import oauth_handler

from config import POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_URL, POSTGRES_USERNAME, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_REGION
from database import db, bcrypt 
from web_socket import socketio
from models import User, Conversation
import jwt
import json
import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql+psycopg2://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_URL}/{POSTGRES_DATABASE}'
bcrypt.init_app(app)
db.init_app(app)
socketio.init_app(app)

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(signup_handler, url_prefix="/signup")
app.register_blueprint(contest_handler, url_prefix="/contests")
app.register_blueprint(
    payment_handler, url_prefix="/users/<int:user_id>/payments")
app.register_blueprint(
    submission_handler, url_prefix='/contests/<int:contest_id>/submissions')
app.register_blueprint(user_handler, url_prefix="/users")
app.register_blueprint(conversation_handler, url_prefix="/conversations")
app.register_blueprint(message_handler, url_prefix="/messages")
app.register_blueprint(
    oauth_handler, url_prefix="/oauth")


# Placeholder secret_key for sessions
app.secret_key = 'secret'


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
@app.route('/home')
def home():

    logged_in = False

    if 'token' in session:
        decoded = decode(session['token'])
        logged_in = True

    return render_template('home.html', logged_in=logged_in, email=decoded)


@app.route('/login', methods=['POST'])
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


@socketio.on('incoming message')
def handle_incoming_message(json, methods=['GET', 'POST']):
    socketio.emit('ack', json)


@socketio.on('join all rooms')
def join_all_conversation_rooms(jwtoken_dict):
    encoded_token = jwtoken_dict['jwtoken']
    decoded_token = jwt.decode(encoded_token, 'secret', algorithm='HS256')
    user = User.query.get_or_404(decoded_token['sub'])
    conversations = Conversation.query.filter(
        Conversation.users.contains(user))
    for conversation in conversations:
        join_room(conversation.id)


if __name__ == '__main__':
    socketio.run(app, debug=True)
