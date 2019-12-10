from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_cors import CORS
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from api.login_handler import login_handler
from api.signup_handler import signup_handler
from api.contest_handler import contest_handler
from api.submission_handler import submission_handler
from api.payment_handler import payment_handler
from api.oauth_handler import oauth_handler
from config import POSTGRES_DATABASE, POSTGRES_PASSWORD, POSTGRES_URL, POSTGRES_USERNAME
from database import db
import jwt
import json
import datetime
from database import db

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql+psycopg2://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_URL}/{POSTGRES_DATABASE}'
db.init_app(app)

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)
app.register_blueprint(login_handler, url_prefix="/login")
app.register_blueprint(signup_handler, url_prefix="/signup")
app.register_blueprint(contest_handler, url_prefix="/contests")
app.register_blueprint(
    submission_handler, url_prefix="/contests/<int:contest_id>/submissions")
app.register_blueprint(
    payment_handler, url_prefix="/users/<int:user_id>/payments")
app.register_blueprint(
    oauth_handler, url_prefix="/oauth")
