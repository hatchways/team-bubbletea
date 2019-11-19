from flask import Blueprint, jsonify, request, redirect
from database import db
from models import User, Submission
from datetime import datetime

submission_handler = Blueprint(
    'submission_handler', __name__, url_prefix='/submissions')
