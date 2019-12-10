from flask import Blueprint, jsonify, request, redirect, url_for
from database import db
from models import Contest
from datetime import datetime
from api.payment_handler import charge_payment
from sqlalchemy.exc import DataError, IntegrityError
from utils import handle_database_error

contest_handler = Blueprint(
    'contest_handler', __name__)


@contest_handler.route('', methods=['GET'])
def show_all():
    user_id = request.args.get('user_id')

    # Retrieve all contests for specific user
    if user_id != None:
        contests = Contest.query.filter_by(user_id=user_id)
        return jsonify([contest.to_dict() for contest in contests])

    contests = Contest.query.all()
    return jsonify([contest.to_dict() for contest in contests])


@contest_handler.route('/new')
def new():
    return jsonify('Show form allowing us to create new contest')


@contest_handler.route('', methods=['POST'])
def create():
    user_id = 1

    try:
        contest = Contest(title=request.json['title'],
                          description=request.json['description'],
                          prize=request.json['prize'],
                          deadline=datetime.strptime(
            request.json['deadline'], "%m/%d/%Y, %H:%M"),
            user_id=user_id)

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
def edit(id):
    contest = Contest.query.get_or_404(id)
    return jsonify('Show form for editing this contest', contest.to_dict())


@contest_handler.route('/<int:id>', methods=['PATCH', 'PUT'])
def update(id):
    contest = Contest.query.get_or_404(id)

    try:
        for key in request.json.keys():
            setattr(contest, key, request.json[key])
        db.session.commit()

    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Contest was not updated.')

    return redirect(url_for('contest_handler.show_contest', id=id))


@contest_handler.route('/<int:id>', methods=['DELETE'])
def delete(id):
    contest = Contest.query.get_or_404(id)

    try:
        db.session.delete(contest)
        db.session.commit()

    except (DataError, AssertionError, IntegrityError) as e:
        db.session.rollback()
        return handle_database_error(e, 'Contest was not deleted.')

    return redirect(url_for('contest_handler.show_all'))
