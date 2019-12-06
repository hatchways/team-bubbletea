from database import db, bcrypt
from sqlalchemy.orm import validates
from datetime import timedelta, datetime


user_conversation_table = db.Table('user_conversation', db.Model.metadata,
    db.Column('conversation_id', db.Integer, db.ForeignKey('conversation.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'))
)

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
    stripe_payments = db.relationship('Payment', backref='customer', lazy=True)
    conversations = db.relationship("Conversation", secondary=user_conversation_table, back_populates="users")
    messages = db.relationship("Message")

    @property
    def password(self):
        raise AttributeError('Passwords cannot be directly accessed')

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8') 

    def check_password(self, password_to_check):
        return bcrypt.check_password_hash(self.password_hash, password_to_check)
        
    
    def __repr__(self):
        return f'User number {self.id}'


class Conversation(db.Model):
    __tablename__ = 'conversation'

    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    users = db.relationship("User", secondary=user_conversation_table, back_populates="conversations") 
    messages = db.relationship("Message")

class Message(db.Model):
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'))
    date_created = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    date_sent = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow)
    message_text =  db.Column(db.String, nullable=False)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id')) 
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

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


class Payment(db.Model):
    __tablename__ = 'payment'

    payment_intent_id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
