from flask import Blueprint, jsonify, request, redirect, url_for
from database import db
from models import User, Payment
from datetime import datetime
from config import STRIPE_PUBLISHABLE_KEY_TEST, STRIPE_SECRET_KEY_TEST, STRIPE_CLIENT_ID_TEST
from uuid import uuid4
import stripe
import secrets

stripe.api_key = STRIPE_SECRET_KEY_TEST

payment_handler = Blueprint('payment_handler', __name__)


@payment_handler.route('/oauth')
def get_oauth_link(user_id):
    state_value = secrets.token_urlsafe()
    redirect_uri = 'http://localhost:3000/payments-demo'
    Oauth_link = (f'https://connect.stripe.com/express/oauth/authorize?' +
                  f'redirect_uri={redirect_uri}&' +
                  f'client_id={STRIPE_CLIENT_ID_TEST}&' +
                  f'state={state_value}&' +
                  f'stripe_user[business_type]=individual&' +
                  f'suggested_capabilities[]=transfers')

    return jsonify({'Oauth_link': Oauth_link})


@payment_handler.route('/secret')
def get_client_secret(user_id):
    intent = stripe.SetupIntent.create()
    return jsonify({'client_secret': intent.client_secret})


@payment_handler.route('/transfers/setup', methods=['POST'])
def setup_transfer_details(user_id):
    user = User.query.get_or_404(user_id)

    authorization_code = request.json['code']

    response = stripe.OAuth.token(
        grant_type='authorization_code',
        code=authorization_code,
    )

    user.stripe_transfer_id = response.stripe_user_id
    db.session.commit()
    return jsonify({'Success': 'Bank account added and can receive transfers'})


@payment_handler.route('/cc/setup', methods=['POST'])
def setup_cc_details(user_id):
    user = User.query.get_or_404(user_id)

    customer = stripe.Customer.create(
        payment_method=request.json['payment_method_id']
    )

    user.stripe_customer_id = customer["id"]
    db.session.commit()

    return jsonify({'Success': 'Credit card added'})


@payment_handler.route('/cc/update', methods=['POST'])
def update_cc_details(user_id):
    user = User.query.get_or_404(user_id)

    payment_methods = stripe.PaymentMethod.list(
        customer=f'{user.stripe_customer_id}',
        type='card',
    )
    credit_card_id = payment_methods['data'][0]['id']
    stripe.PaymentMethod.detach(credit_card_id)

    stripe.PaymentMethod.attach(
        request.json['payment_method_id'],
        customer=user.stripe_customer_id,
    )
    return jsonify({'Success': 'Credit card updated'})

# owner creates contest and makes payment, which will later be sent to winner
@payment_handler.route('/cc/pay', methods=['POST'])
def charge_payment(user_id):
    user = User.query.get_or_404(user_id)

    payment_methods = stripe.PaymentMethod.list(
        customer=f'{user.stripe_customer_id}',
        type='card',
    )
    credit_card_id = payment_methods['data'][0]['id']

    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=request.json['amount'],
            currency='usd',
            customer=user.stripe_customer_id,
            payment_method=credit_card_id,
            off_session=True,
            confirm=True,
            metadata={'contest_id': request.json['contest_id']},
            idempotency_key=str(uuid4())
        )
        payment = Payment(
            user_id=user.id, payment_intent_id=payment_intent['id'])
        db.session.add(payment)
        db.session.commit()

    except stripe.error.CardError as e:
        err = e.error
        # Error code will be authentication_required if authentication is needed
        print("Code is: %s" % err.code)
        payment_intent_id = err.payment_intent['id']
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

    return jsonify({'Success': 'Payment charged'})


@payment_handler.route('/transfers/receive', methods=['POST'])
def receive_payment(user_id):
    user = User.query.get_or_404(user_id)

    stripe.Transfer.create(
        amount=request.json['amount'],
        currency='usd',
        destination=user.stripe_transfer_id,
    )
    return jsonify({'Success': 'Payment received'})


@payment_handler.route('/cc/refund', methods=['POST'])
def refund_owner(user_id):
    stripe.Refund.create(
        payment_intent=request.json['payment_intent_id']
    )
    return jsonify({'Success': 'Refund processed'})


@payment_handler.route('/cc/charges')
def get_payments(user_id):
    user = User.query.get_or_404(user_id)
    payments = Payment.query.filter_by(user_id=user.id).all()
    return jsonify([payment['id'] for payment in payments])
