from flask import jsonify
from functools import wraps
from flask import request
import jwt
from models import User


def handle_stripe_error(e, custom_msg=None):
    if not e.http_status:
        msg = "We have been unable to connect to Stripe."
        status = 503
    elif e.http_status // 100 == 4:
        msg = 'There was a mistake with the request sent to Stripe from our servers.'
        status = 500
    elif e.http_status // 100 == 5:
        msg = "There is currently a problem with Stripe's servers."
        status = 503
    else:
        msg = "We have been unable to connect to Stripe."
        status = 503
    print(e)
    return jsonify({
        'success': False,
        'error': {
            'type': e.__class__.__name__,
            'message': [str(x) for x in e.args] + ([msg, custom_msg] if custom_msg else [msg])
        }
    }), status


def handle_database_error(e, custom_msg=None):
    print(e)
    return jsonify({
        'success': False,
        'error': {
            'type': e.__class__.__name__,
            'message': [str(x) for x in e.args] + ([custom_msg] if custom_msg else [])
        }
    }), 400


def handle_amazon_error(e, custom_msg=None):
    msg = 'We could not retrieve/upload your images at this time.'
    print(e)
    return jsonify({
        'success': False,
        'error': {
            'type': e.__class__.__name__,
            'message': [str(x) for x in e.args] + ([msg, custom_msg] if custom_msg else [msg])
        }
    }), 503


def handle_authentication_error(user_specific=False, custom_msg=None):
    msg = 'Wrong user' if user_specific else 'You need to login to take this action.'
    print(msg)
    return jsonify({
        'success': False,
        'error': {
            'type': 'Authentication Error',
            'message': [msg, custom_msg] if custom_msg else [msg]
        }
    }), 401


def requires_authentication(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        parameters = request.get_json()
        if not parameters or 'jwtoken' not in parameters.keys():
            return handle_authentication_error()
        token = jwt.decode(parameters['jwtoken'], 'secret', algorithm='HS256')
        user = User.query.get_or_404(token['sub'])
        return func(authenticated_user_id=user.id, *args, **kwargs)
    return decorated
