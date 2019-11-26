from database import db
from sqlalchemy.orm import validates
from datetime import timedelta, datetime


class User(db.Model):
    # dummy user model for now that will allow us to create contests
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    contests = db.relationship('Contest', backref='owner', lazy=True)
    submissions = db.relationship('Submission', backref='artist', lazy=True)
    stripe_transfer_id = db.Column(db.String)
    stripe_customer_id = db.Column(db.String)

    def __repr__(self):
        return f'User number {self.id}'


class Contest(db.Model):
    __tablename__ = 'contest'

    id = db.Column(db.Integer, primary_key=True)

    # should we force title to be unique or no?
    title = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)

    # need to decide which fields should allow null values
    prize = db.Column(db.Float, nullable=False, default=0.0)
    deadline = db.Column(db.DateTime, nullable=False)
    date_created = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    submissions = db.relationship('Submission', backref='contest', lazy=True)

    def __repr__(self):
        return f'Contest {self.id}, Title: {self.title}'

    def to_dict(self):
        return {'title': self.title,
                'user': self.user_id,
                'contestid': self.id,
                'description': self.description,
                'prize': self.prize,
                'deadline': self.deadline,
                'date_created': self.date_created,
                'submissions': [submission.id for submission in self.submissions]}

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
    date_submitted = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)

    # do we store a link to image? how will this work with aws?
    image = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'Submission {self.id}, Contest: {self.contest_id}, User: {self.user_id}'

    def to_dict(self):
        return {'user': self.user_id,
                'submission_id': self.id,
                'contest_id': self.contest_id,
                'contest_title': self.contest.title,
                'active': self.active}
