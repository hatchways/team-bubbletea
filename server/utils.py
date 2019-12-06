from flask import jsonify


def handle_stripe_error(e, custom_msg=None):
    if e.http_status // 100 == 4:
        msg = 'We have made a mistake storing your Stripe data.'
        status = 500
    elif e.http_status // 100 == 5:
        msg = "There is currently a problem with Stripe's servers."
        status = 503
    else:
        msg = "We have been unable to connect to Stripe."
        status = 503
    return jsonify({
        'success': False,
        'error': {
            'type': e.__class__.__name__,
            'message': [str(x) for x in e.args] + ([msg, custom_msg] if custom_msg else [msg])
        }
    }), status


def handle_database_error(e, custom_msg=None):
    return jsonify({
        'success': False,
        'error': {
            'type': e.__class__.__name__,
            'message': [str(x) for x in e.args] + ([custom_msg] if custom_msg else [])
        }
    }), 400


def handle_amazon_error(e, custom_msg=None):
    msg = 'We could not retrieve/upload your images at this time.'
    return jsonify({
        'success': False,
        'error': {
            'type': e.__class__.__name__,
            'message': [str(x) for x in e.args] + ([msg, custom_msg] if custom_msg else [msg])
        }
    }), 503
