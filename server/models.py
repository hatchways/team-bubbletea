from database import db, bcrypt
from sqlalchemy.orm import validates
from datetime import timedelta, datetime


user_conversation_table = db.Table('user_conversation', db.Model.metadata,
                                   db.Column('conversation_id', db.Integer,
                                             db.ForeignKey('conversation.id')),
                                   db.Column('user_id', db.Integer,
                                             db.ForeignKey('user.id'))
                                   )


class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'))
    date_created = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    date_sent = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    message_text = db.Column(db.String, nullable=False)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    from_user = db.relationship('User', foreign_keys=[from_user_id])
    to_user = db.relationship('User', foreign_keys=[to_user_id])

    def to_dict(self):
        return {'message_id': self.id,
                'conversation_id': self.conversation_id,
                'date_created': self.date_created.strftime("%d/%m/%Y, %H:%M:%S"),
                'date_sent': self.date_sent.strftime("%d/%m/%Y, %H:%M:%S"),
                'message_text': self.message_text,
                'from_user': self.from_user.to_dict(),
                'to_user': self.to_user.to_dict()}


class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    contests = db.relationship('Contest', backref='owner', lazy=True)
    submissions = db.relationship('Submission', backref='artist', lazy=True)
    stripe_transfer_id = db.Column(db.String)
    stripe_customer_id = db.Column(db.String)
    conversations = db.relationship(
        'Conversation', secondary=user_conversation_table, back_populates="users")
    messages_to_user = db.relationship(
        'Message', foreign_keys=[Message.to_user_id])
    messages_from_user = db.relationship(
        'Message', foreign_keys=[Message.from_user_id])

    @property
    def password(self):
        raise AttributeError('Passwords cannot be directly accessed')

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password).decode('utf-8')

    def check_password(self, password_to_check):
        return bcrypt.check_password_hash(self.password_hash, password_to_check)

    def __repr__(self):
        return f'User number {self.id}'

    def to_dict(self):
        return {'user_id': self.id,
                'first_name': self.first_name,
                'last_name': self.last_name}


class Conversation(db.Model):
    __tablename__ = 'conversation'

    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    users = db.relationship(
        'User', secondary=user_conversation_table, back_populates="conversations")
    messages = db.relationship('Message')

    def to_dict(self):
        return {
            'conversation_id': self.id,
            'date_created': self.date_created,
            'users': [user.to_dict() for user in self.users]
        }


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
        assert deadline < datetime.now(
        ) + timedelta(days=365), "Contest deadline must be within the next year."
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
        assert winner == False or sum([1 for sub in submissions if sub.winner == True and sub.id != self.id]
                                      ) <= 0, "You cannot declare more than one winner of this contest."

        return winner

    @validates('active')
    def validate_active(self, key, active):
        my_submissions = Submission.query.filter_by(
            contest_id=self.contest_id, user_id=self.user_id)
        assert active == False or sum([1 for sub in my_submissions if sub.active == True and sub.id != self.id]
                                      ) == 0, "A user cannot have more than one active submission for a single contest. "
        return active
