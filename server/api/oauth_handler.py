from flask import Blueprint, jsonify, request
from database import db
from models import User
from config import STRIPE_SECRET_KEY_TEST
import stripe
from utils import handle_stripe_error

oauth_handler = Blueprint('oauth_handler', __name__)

stripe.api_key = STRIPE_SECRET_KEY_TEST


@oauth_handler.route('', methods=['GET', 'POST'])
def setup_transfer_details():
    user = User.query.get_or_404(request.args['state'])
    try:
        response = stripe.OAuth.token(
            grant_type='authorization_code',
            code=request.args['code'],
        )
    except stripe.error.StripeError as e:
        return handle_stripe_error(e)

    user.stripe_transfer_id = response['stripe_user_id']
    db.session.commit()
    return jsonify({'Success': 'Bank account added and can receive transfers'})
