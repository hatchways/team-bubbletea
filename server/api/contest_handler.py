from flask import Blueprint, jsonify, request, redirect, url_for
from database import db
from models import Contest, User
from datetime import datetime
from api.payment_handler import charge_payment
from sqlalchemy.exc import DataError, IntegrityError
from utils import handle_database_error, handle_authentication_error, requires_authentication
import jwt

contest_handler = Blueprint(
    'contest_handler', __name__)


@contest_handler.route('', methods=['GET'])
def show_all():
    user_id = request.args.get('user_id')
    completed = request.args.get('completed')
    current_time = datetime.utcnow()

    # Retrieve all contests for specific user
    if user_id != None:
        if completed == "True":
            contests = Contest.query.filter(Contest.deadline <= current_time).filter_by(user_id=user_id).all()
            return jsonify([contest.to_dict() for contest in contests])
        elif completed == "False":
            contests = Contest.query.filter(Contest.deadline > current_time).filter_by(user_id=user_id).all()
            return jsonify([contest.to_dict() for contest in contests])

        contests = Contest.query.filter_by(user_id=user_id)
        return jsonify([contest.to_dict() for contest in contests])

    # No specific user
    if completed == "True":
        contests = Contest.query.filter(Contest.deadline <= current_time).all()
        return jsonify([contest.to_dict() for contest in contests])
    elif completed == "False":
        contests = Contest.query.filter(Contest.deadline > current_time).all()
        return jsonify([contest.to_dict() for contest in contests])

    contests = Contest.query.all()
    return jsonify([contest.to_dict() for contest in contests])


@contest_handler.route('/new')
@requires_authentication
def new():
    return jsonify('Show form allowing us to create new contest')


@contest_handler.route('', methods=['POST'])
@requires_authentication
def create(authenticated_user_id):
    parameters = request.get_json()
    try:
        contest = Contest(title=parameters['title'],
                          description=parameters['description'],
                          prize=parameters['prize'],
                          deadline=datetime.strptime(
            parameters['deadline'], "%m/%d/%Y, %H:%M:%S"),
            user_id=authenticated_user_id)

        db.session.add(contest)
        db.session.commit()

        # We are currently charging contest owner when winner is declared,
        #   but we may want to change it to charge them when contest is
        #   created
        # charge_payment(contest.id)

    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Contest was not added.')

    return redirect(url_for('contest_handler.show_contest', id=contest.id))


@contest_handler.route('/<int:id>')
def show_contest(id):
    contest = Contest.query.get_or_404(id)
    return jsonify(contest.to_dict())


@contest_handler.route('/<int:id>/edit')
@requires_authentication
def edit(authenticated_user_id, id):
    contest = Contest.query.get_or_404(id)
    if contest.owner.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)
    return jsonify('Show form for editing this contest', contest.to_dict())


@contest_handler.route('/<int:id>', methods=['PATCH', 'PUT'])
@requires_authentication
def update(authenticated_user_id, id):
    contest = Contest.query.get_or_404(id)
    if contest.owner.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    try:
        for key in request.json.keys():
            setattr(contest, key, request.json[key])
        db.session.commit()

    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Contest was not updated.')

    return redirect(url_for('contest_handler.show_contest', id=id))


@contest_handler.route('/<int:id>', methods=['DELETE'])
@requires_authentication
def delete(authenticated_user_id, id):
    contest = Contest.query.get_or_404(id)
    if contest.owner.id != authenticated_user_id:
        return handle_authentication_error(user_specific=True)

    try:
        db.session.delete(contest)
        db.session.commit()

    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Contest was not deleted.')

    return redirect(url_for('contest_handler.show_all'))
