from flask import Blueprint, jsonify, request, redirect, url_for
from database import db
from models import User, Contest, Submission
from datetime import datetime
from config import STRIPE_PUBLISHABLE_KEY_TEST, STRIPE_SECRET_KEY_TEST, STRIPE_CLIENT_ID_TEST, REDIRECT_URI_BASE
from uuid import uuid4
import stripe
import secrets

stripe.api_key = STRIPE_SECRET_KEY_TEST

payment_handler = Blueprint('payment_handler', __name__)


@payment_handler.route('/transfers/info')
def get_transfer_info(user_id):
    redirect_uri = f'{REDIRECT_URI_BASE}/oauth'
    Oauth_link = (f'https://connect.stripe.com/express/oauth/authorize?' +
                  f'redirect_uri={redirect_uri}&' +
                  f'client_id={STRIPE_CLIENT_ID_TEST}&' +
                  f'state={user_id}&' +
                  f'stripe_user[business_type]=individual&' +
                  f'suggested_capabilities[]=transfers')

    user = User.query.get_or_404(user_id)

    return jsonify({'Oauth_link': Oauth_link, 'stripe_acct': user.stripe_transfer_id})


@payment_handler.route('/cc/info')
def get_cc_info(user_id):
    intent = stripe.SetupIntent.create()
    user = User.query.get_or_404(user_id)

    try:
        if user.stripe_customer_id:
            payment_methods = stripe.PaymentMethod.list(
                customer=f'{user.stripe_customer_id}',
                type='card',
            )
            credit_card = payment_methods['data'][0]['card']
    except stripe.error.StripeError as e:
        return jsonify({'error': e}), 500

    cc_data = {
        'client_secret': intent.client_secret,
        'last4': credit_card['last4'] if user.stripe_customer_id else None,
        'brand': credit_card['brand'] if user.stripe_customer_id else None,
        'exp_month': credit_card['exp_month'] if user.stripe_customer_id else None,
        'exp_year': credit_card['exp_year'] if user.stripe_customer_id else None
    }

    return jsonify(cc_data)


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


@payment_handler.route('/cc/history')
def get_payment_history(user_id):
    user = User.query.get_or_404(user_id)
    payment_intents = stripe.PaymentIntent.list(
        customer=user.stripe_customer_id)
    return jsonify([{
        'id': payment['id'],
        'amount':payment['amount'],
        'contest_id':payment['metadata']['contest_id']
    } for payment in payment_intents['data']])


@payment_handler.route('/transfers/history')
def get_transfer_history(user_id):
    user = User.query.get_or_404(user_id)
    transfers = stripe.Transfer.list(
        destination=user.stripe_transfer_id)
    return jsonify([{
        'id': transfer['id'],
        'amount':transfer['amount'],
        'contest_id':transfer['metadata']['contest_id']
    } for transfer in transfers['data']])


@payment_handler.route('/cc/refund', methods=['POST'])
def refund_owner(user_id):
    payment_intent = stripe.PaymentIntent.retrieve(
        request.json['payment_intent_id'])
    stripe.Refund.create(payment_intent=payment_intent.id)
    contest = Contest.query.get_or_404(
        payment_intent['metadata']['contest_id'])
    contest.owner_payment = False
    db.session.commit()
    return jsonify({'Success': 'Refund processed'})


def charge_payment(contest_id):
    contest = Contest.query.get_or_404(contest_id)

    payment_methods = stripe.PaymentMethod.list(
        customer=f'{contest.owner.stripe_customer_id}',
        type='card',
    )
    credit_card_id = payment_methods['data'][0]['id']

    try:
        stripe.PaymentIntent.create(
            amount=int(contest.prize*100),
            currency='usd',
            customer=contest.owner.stripe_customer_id,
            payment_method=credit_card_id,
            off_session=True,
            confirm=True,
            metadata={'contest_id': contest.id},
            idempotency_key=str(uuid4())
        )

        contest.owner_payment = True
        db.session.commit()

    except stripe.error.CardError as e:
        err = e.error
        print("Code is: %s" % err.code)

    return jsonify({'Success': 'Payment charged'})


def send_transfer(contest_id):
    submission = Submission.query.filter_by(
        contest_id=contest_id, winner=True).first()

    stripe.Transfer.create(
        amount=int(submission.contest.prize*100),
        currency='usd',
        destination=submission.artist.stripe_transfer_id,
        metadata={'contest_id': submission.contest.id}
    )

    submission.contest.winner_transfer = True
    db.session.commit()

    return jsonify({'Success': 'Payment received'})
