from database import db
from sqlalchemy.orm import validates
from datetime import timedelta, datetime


class User(db.Model):
    # dummy user model for now that will allow us to create contests
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    contests = db.Relationship('Contest', backref='owner', lazy=True)
    submissions = db.Relationship('Submission', backref='artist', lazy=True)

    def __repr__(self):
        return f'User number {self.id}'


class Contest(db.Model):
    __tablename__ = 'contest'

    id = db.Column(db.Integer, primary_key=True)

    # should we force title to be unique or no?
    title = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)

    # need to decide which fields should allow null values
    prize = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    submissions = db.Relationship('Submission', backref='contest', lazy=True)

    def __repr__(self):
        return f'Contest {self.id}, Title: {self.title}'

    # example validation making sure deadline for contest is
    #   within the next year, need to decide on what to validate
    #   for both models

    @validates('deadline')
    def validate_deadline(self, key, deadline):
        # take other action besides assert
        assert deadline < datetime.now() + timedelta(days=365)
        return deadline


class Submission(db.Model):
    __tablename__ = 'submission'

    # not sure if we want this submission id, or just use combo of user_id
    #   and contest_id as primary key if we want to allow only one submission
    #   per contest per user
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    contest_id = db.Column(db.Integer, db.ForeignKey(
        'contest.id'), nullable=False)
    active = db.Column(db.Boolean, default=True)
    date_submitted = db.Column(db.DateTime, nullable=False)

    # do we store a link to image? how will this work with aws?
    image = db.Column(db.LargeBinary, unique=True, nullable=False)

    def __repr__(self):
        return f'Submission {self.id}, Contest: {self.contest_id}, User: {self.user_id}'
