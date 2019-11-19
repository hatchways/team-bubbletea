from flask import Blueprint, jsonify, request, redirect, url_for
from database import db
from models import Contest
from datetime import datetime

contest_handler = Blueprint(
    'contest_handler', __name__, url_prefix='/contests')


@contest_handler.route('')
def show_all():
    contests = Contest.query.all()
    return jsonify([contest.to_dict() for contest in contests])

# view for creating a new contest, could potentially be combined with show_all()
@contest_handler.route('/new')
def new():
    return jsonify('Show form allowing us to create new contest')


@contest_handler.route('', methods=['POST'])
def create():
    input_data = request.json

    # just using a dummy user for now, need to create user with id=1 in postgres for this to work
    user_id = 1

    title = input_data['title']
    description = input_data['description']
    prize = input_data['prize']
    deadline = datetime.strptime(input_data['deadline'], "%m/%d/%Y, %H:%M:%S")
    date_created = datetime.now()

    contest = Contest(title=title, description=description,
                      prize=prize, deadline=deadline, 
                      date_created=date_created, user_id=user_id)
    db.session.add(contest)
    db.session.commit()
    return redirect(f'/contests/{contest.id}')


@contest_handler.route('/<int:id>')
def show_contest(id):
    contest = Contest.query.get(id)
    return jsonify(contest.to_dict())

# dedicated page for editing a contest, could potentially be combined with show_contest()
@contest_handler.route('/<int:id>/edit')
def edit(id):
    contest = Contest.query.get(id)
    return jsonify('Show form for editing this contest', contest.to_dict())


@contest_handler.route('/<int:id>', methods=['POST', 'PATCH', 'PUT'])
def update(id):
    contest = Contest.query.get(id)
    input_data = request.json
    # may be a better way to do this than setattr
    for key in input_data.keys():
        setattr(contest, key, input_data[key])
    db.session.commit()
    return redirect(f'/contests/{id}')


@contest_handler.route('/<int:id>', methods=['DELETE'])
def delete(id):
    contest = Contest.query.get(id)
    db.session.delete(contest)
    db.session.commit()
    return redirect(url_for('show_all'))
