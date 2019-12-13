from flask import Blueprint, jsonify, request, redirect, url_for, make_response
from database import db
from models import User, Contest, Submission
from datetime import datetime
from config import STRIPE_PUBLISHABLE_KEY_TEST, STRIPE_SECRET_KEY_TEST, STRIPE_CLIENT_ID_TEST, REDIRECT_URI_BASE
from uuid import uuid4
import stripe
import secrets
from sqlalchemy.exc import DataError, IntegrityError
from utils import handle_stripe_error, handle_database_error, handle_authentication_error, requires_authentication

stripe.api_key = STRIPE_SECRET_KEY_TEST

payment_handler = Blueprint('payment_handler', __name__)


@payment_handler.route('/transfers/info')
@requires_authentication
def get_transfer_info(authenticated_user_id, user_id):
    user = User.query.get_or_404(user_id)
    if user.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    redirect_uri = f'{REDIRECT_URI_BASE}/oauth'
    Oauth_link = (f'https://connect.stripe.com/express/oauth/authorize?' +
                  f'redirect_uri={redirect_uri}&' +
                  f'client_id={STRIPE_CLIENT_ID_TEST}&' +
                  f'state={user.id}&' +
                  f'stripe_user[business_type]=individual&' +
                  f'suggested_capabilities[]=transfers')

    return jsonify({'Oauth_link': Oauth_link, 'stripe_acct': user.stripe_transfer_id})


@payment_handler.route('/cc/info')
@requires_authentication
def get_cc_info(authenticated_user_id, user_id):
    intent = stripe.SetupIntent.create()
    user = User.query.get_or_404(user_id)
    if user.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    try:
        if user.stripe_customer_id:
            payment_methods = stripe.PaymentMethod.list(
                customer=f'{user.stripe_customer_id}',
                type='card',
            )
            credit_card = payment_methods['data'][0]['card']
    except stripe.error.StripeError as e:
        return handle_stripe_error(e)

    cc_data = {
        'client_secret': intent.client_secret,
        'last4': credit_card['last4'] if user.stripe_customer_id else None,
        'brand': credit_card['brand'] if user.stripe_customer_id else None,
        'exp_month': credit_card['exp_month'] if user.stripe_customer_id else None,
        'exp_year': credit_card['exp_year'] if user.stripe_customer_id else None
    }

    return jsonify(cc_data)


@payment_handler.route('/cc/setup', methods=['POST'])
@requires_authentication
def setup_cc_details(authenticated_user_id, user_id):
    user = User.query.get_or_404(user_id)
    if user.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    try:
        customer = stripe.Customer.create(
            payment_method=request.json['payment_method_id']
        )
    except stripe.error.StripeError as e:
        return handle_stripe_error(e)

    user.stripe_customer_id = customer["id"]
    db.session.commit()

    return jsonify({'success': 'Credit card added'})


@payment_handler.route('/cc/update', methods=['POST'])
@requires_authentication
def update_cc_details(authenticated_user_id, user_id):
    user = User.query.get_or_404(user_id)
    if user.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    try:
        payment_methods = stripe.PaymentMethod.list(
            customer=f'{user.stripe_customer_id}',
            type='card',
        )
        if payment_methods:
            credit_card_id = payment_methods['data'][0]['id']
            stripe.PaymentMethod.detach(credit_card_id)

        stripe.PaymentMethod.attach(
            str(request.json['payment_method_id']),
            customer=user.stripe_customer_id,
        )
    except stripe.error.StripeError as e:
        return handle_stripe_error(e)

    return jsonify({'success': 'Credit card updated'})


@payment_handler.route('/cc/history')
@requires_authentication
def get_payment_history(authenticated_user_id, user_id):
    user = User.query.get_or_404(user_id)
    if user.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    try:
        payment_intents = stripe.PaymentIntent.list(
            customer=user.stripe_customer_id)
    except stripe.error.StripeError as e:
        return handle_stripe_error(e)

    return jsonify([{
        'transaction_id': payment['id'],
        'amount':f"$ {payment['amount']/100:.2f}",
        'contest_id':payment['metadata']['contest_id'],
        'contest_title':Contest.query.get_or_404(payment['metadata']['contest_id']).title
    } for payment in payment_intents['data']])


@payment_handler.route('/transfers/history')
@requires_authentication
def get_transfer_history(authenticated_user_id, user_id):
    user = User.query.get_or_404(user_id)
    if user.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    try:
        transfers = stripe.Transfer.list(
            destination=user.stripe_transfer_id)
    except stripe.error.StripeError as e:
        return handle_stripe_error(e)

    return jsonify([{
        'transaction_id': transfer['id'],
        'amount':f"$ {transfer['amount']/100:.2f}",
        'contest_id':transfer['metadata']['contest_id'],
        'contest_title':Contest.query.get_or_404(transfer['metadata']['contest_id']).title
    } for transfer in transfers['data']])


@payment_handler.route('/cc/refund', methods=['POST'])
@requires_authentication
def refund_owner(authenticated_user_id, user_id):
    user = User.query.get_or_404(user_id)
    if user.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)
    try:
        payment_intent = stripe.PaymentIntent.retrieve(
            str(request.json['payment_intent_id']))
        stripe.Refund.create(payment_intent=payment_intent.id)
    except stripe.error.StripeError as e:
        return handle_stripe_error(e)

    contest = Contest.query.get_or_404(
        payment_intent['metadata']['contest_id'])

    contest.owner_payment = False
    db.session.commit()

    return jsonify({'success': 'Refund processed'})


def charge_payment(contest_id):
    contest = Contest.query.get_or_404(contest_id)

    try:
        payment_methods = stripe.PaymentMethod.list(
            customer=f'{contest.owner.stripe_customer_id}',
            type='card',
        )

        credit_card_id = payment_methods['data'][0]['id']

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
        raise e

    return jsonify({'Success': 'Payment charged'})


def send_transfer(contest_id):
    submission = Submission.query.filter_by(
        contest_id=contest_id, winner=True).first()

    try:
        submission.contest.winner_transfer = True
        db.session.commit()

        stripe.Transfer.create(
            amount=int(submission.contest.prize*100),
            currency='usd',
            destination=submission.artist.stripe_transfer_id,
            metadata={'contest_id': submission.contest.id}
        )

    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        e.args = e.args + \
            ('Transfer not sent because winner could not be declared',)
        raise e

    except stripe.error.StripeError as e:
        raise e

    return jsonify({'Success': 'Payment received'})
