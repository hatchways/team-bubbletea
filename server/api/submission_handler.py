from flask import Blueprint, jsonify, request, redirect, url_for
from database import db
from models import User, Submission, Contest
from datetime import datetime

submission_handler = Blueprint('submission_handler', __name__)


@submission_handler.route('')
def show_all(contest_id):
    submissions = Submission.query.filter_by(contest_id=contest_id).all()
    return jsonify([submission.to_dict() for submission in submissions])

# view for creating a new contest, could potentially be combined with show_all()
@submission_handler.route('/new')
def new(contest_id):
    return jsonify('Show form allowing us to create new submission')


@submission_handler.route('', methods=['POST'])
def create(contest_id):
    # just using a dummy user for now, need to create user with id=1 in postgres for this to work
    user_id = 1

    submission = Submission(
        user_id=user_id, contest_id=contest_id, image='No Image')

    db.session.add(submission)
    db.session.commit()
    return redirect(url_for('submission_handler.show_submission', contest_id=contest_id, submission_id=submission.id))


@submission_handler.route('/<int:submission_id>')
def show_submission(contest_id, submission_id):
    submission = Submission.query.get_or_404(submission_id)
    return jsonify(submission.to_dict())

# dedicated page for editing a contest, could potentially be combined with show_contest()
@submission_handler.route('/<int:submission_id>/edit')
def edit(contest_id, submission_id):
    submission = Submission.query.get_or_404(id)
    return jsonify('Show form for editing this submission', submission.to_dict())


@submission_handler.route('/<int:submission_id>', methods=['PATCH', 'PUT'])
def update(contest_id, submission_id):
    submission = Submission.query.get_or_404(id)
    # may be a better way to do this than setattr
    for key in request.json.keys():
        setattr(submission, key, request.json[key])
    db.session.commit()
    return redirect(url_for('submission_handler.show_contest', contest_id=contest_id, submission_id=submission.id))


@submission_handler.route('/<int:submission_id>', methods=['DELETE'])
def delete(contest_id, submission_id):
    submission = Submission.query.get_or_404(id)
    db.session.delete(submission)
    db.session.commit()
    return redirect(url_for('submission_handler.show_all', contest_id=contest_id))
