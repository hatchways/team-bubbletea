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
    title = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    prize = db.Column(db.Float, nullable=False, default=0.0)
    deadline = db.Column(db.DateTime, nullable=False)
    date_created = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    submissions = db.relationship('Submission', backref='contest', lazy=True)
    owner_payment = db.Column(db.Boolean, default=False)
    winner_transfer = db.Column(db.Boolean, default=False)

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

    @validates('deadline')
    def validate_deadline(self, key, deadline):
        assert deadline < datetime.now() + timedelta(days=365)
        return deadline

    @validates('winner_transfer')
    def validate_winner_transfer(self, key, winner_transfer):
        assert winner_transfer == False or self.owner_payment == True, '''Transfer cannot 
            be made to contest winner since payment has not been received from contest owner.'''

    @validates('prize')
    def validate_prize(self, key, prize):
        assert (prize >= 0), "Nice try. This isn't a charity."
        return prize


class Submission(db.Model):
    __tablename__ = 'submission'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    contest_id = db.Column(db.Integer, db.ForeignKey(
        'contest.id'), nullable=False)
    active = db.Column(db.Boolean, default=True)
    date_submitted = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    image = db.Column(db.String, nullable=False)
    winner = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'Submission {self.id}, Contest: {self.contest_id}, User: {self.user_id}'

    def to_dict(self):
        return {'user': self.user_id,
                'submission_id': self.id,
                'contest_id': self.contest_id,
                'contest_title': self.contest.title,
                'active': self.active}

    @validates('winner')
    def validate_winner(self, key, winner):
        assert winner == False or self.contest.deadline < datetime.now(
        ), "You cannot declare a winner until after the contest deadline."
        submissions = Submission.query.filter_by(contest_id=self.contest_id)
        assert sum([1 for s in submissions if s.winner == True]
                   ) <= 1, "You cannot declare more than one winner of this contest."

        return winner
