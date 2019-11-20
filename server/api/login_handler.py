from flask import render_template, Blueprint
login_handler = Blueprint('login_handler', __name__)


@login_handler.route('/login')
def login():
    return render_template('login.html')
