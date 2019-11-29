from flask import Blueprint, jsonify, request, redirect, url_for
from database import db
from models import User
from datetime import datetime
from config import STRIPE_PUBLISHABLE_KEY_TEST, STRIPE_SECRET_KEY_TEST, STRIPE_CLIENT_ID_TEST
from uuid import uuid4
import stripe

stripe.api_key = STRIPE_SECRET_KEY_TEST

payment_handler = Blueprint('payment_handler', __name__)


@payment_handler.route('')
def home(user_id):
    csrf_token = 'null'
    redirect_uri = f'https://localhost/users/{user_id}/payments/setup-transfers'

    Oauth_link = (f'https://connect.stripe.com/express/oauth/authorize?' +
                  f'redirect_uri={redirect_uri}&' +
                  f'client_id={STRIPE_CLIENT_ID_TEST}&' +
                  f'state={csrf_token}&' +
                  f'stripe_user[business_type]=individual&' +
                  f'suggested_capabilities[]=transfers')

    intent = stripe.SetupIntent.create()
    return jsonify({'client_secret': intent.client_secret, 'Oauth_link': Oauth_link})


# user adds deposit info so he/she can receive payment upon winning contest
@payment_handler.route('/transfers/setup')
def setup_transfer_details(user_id):
    user = User.query.get_or_404(user_id)

    authorization_code = request.args['code']
    response = stripe.OAuth.token(
        grant_type='authorization_code',
        code=authorization_code,
    )

    user.stripe_transfer_id = response.stripe_user_id
    db.session.commit()
    return jsonify({})


# user adds credit card info to make payments whenever he/she creates a contest
# figure out intent.payment_method
@payment_handler.route('/cc/setup', methods=['POST'])
def setup_cc_details(user_id):
    user = User.query.get_or_404(user_id)

    customer = stripe.Customer.create(
        payment_method=request.json['payment_method_id']
    )

    user.stripe_customer_id = customer["id"]
    db.session.commit()
    return jsonify({'Success': 'Credit card added'})

# artist updates deposit info
@payment_handler.route('/transfers/update')
def update_transfer_details(user_id):
    pass

# contest owner updates payment info
# figure out intent.payment_method
@payment_handler.route('/cc/update')
def update_cc_details(user_id, payment_method_id):
    user = User.query.get_or_404(user_id)

    payment_method = stripe.PaymentMethod.attach(
        payment_method_id,
        customer=f'{user.stripe_customer_id}'
    )
    return jsonify({})

# owner creates contest and makes payment, which will later be sent to winner
@payment_handler.route('/cc/pay')
def charge_payment(user_id):
    user = User.query.get_or_404(user_id)
    contest_id = request.args['contestid']

    payment_methods = stripe.PaymentMethod.list(
        customer=f'{user.stripe_customer_id}',
        type='card',
    )

    try:
        stripe.PaymentIntent.create(
            amount=1099,
            currency='usd',
            customer=user.stripe_customer_id,
            payment_method=payment_methods[0]["id"],
            off_session=True,
            confirm=True,
            metadata={'contest_id': contest_id},
            idempotency_key=str(uuid4())
        )

    except stripe.error.CardError as e:
        err = e.error
        # Error code will be authentication_required if authentication is needed
        print("Code is: %s" % err.code)
        payment_intent_id = err.payment_intent['id']
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

    return jsonify({})


# winner of contest receives payment
@payment_handler.route('/transfers/receive')
def receive_payment(user_id):
    transfer = stripe.Transfer.create(
        amount=7000,
        currency='usd',
        source_transaction="{CHARGE_ID}",
        destination='{{CONNECTED_STRIPE_ACCOUNT_ID}}',
        transfer_group='{ORDER10}',
    )

    return jsonify({})

# owner gets refund
@payment_handler.route('/cc/refund')
def refund_owner(user_id):
    refund = stripe.Refund.create(
        charge='{CHARGE_ID}',
    )

    return jsonify({})
