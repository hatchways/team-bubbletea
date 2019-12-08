from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_cors import CORS
from flask_socketio import join_room, send
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.contest_handler import contest_handler
from api.submission_handler import submission_handler
from api.payment_handler import payment_handler
from api.oauth_handler import oauth_handler
from api.user_handler import user_handler
from api.conversation_handler import conversation_handler
from api.message_handler import message_handler
from config import POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_URL, POSTGRES_USERNAME
from database import db, bcrypt
from web_socket import socketio
from models import User
import jwt
import json
import datetime


def create_app():
    app = Flask(__name__)
    CORS(app)
    #app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql+psycopg2://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_URL}/{POSTGRES_DATABASE}'

    bcrypt.init_app(app)
    db.init_app(app)
    socketio.init_app(app)

    app.register_blueprint(home_handler)
    app.register_blueprint(ping_handler)
    app.register_blueprint(contest_handler, url_prefix="/contests")
    app.register_blueprint(
        submission_handler, url_prefix="/contests/<int:contest_id>/submissions")
    app.register_blueprint(
        payment_handler, url_prefix="/users/<int:user_id>/payments")
    app.register_blueprint(
        oauth_handler, url_prefix="/oauth")
    app.register_blueprint(user_handler, url_prefix="/users")
    app.register_blueprint(conversation_handler, url_prefix="/conversations")
    app.register_blueprint(message_handler, url_prefix="/messages")

    # Placeholder secret_key for sessions
    app.secret_key = 'secret'

    # socketio.run(app)

    return app


@socketio.on('connect')
def test_connect():
    socketio.emit('my response', 'lets dance')
    join_room('test room')
    send('User has joined test room', room='test room')


@socketio.on('incoming message')
def handle_incoming_message(json, methods=['GET', 'POST']):
    socketio.emit('ack', json)
    # socketio.emit('incoming response', json)


@socketio.on('join room')
def join_conversation_room(conversation_id):
    join_room(conversation_id)
    send('User has joined the room')
