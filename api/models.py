from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4


def get_uuid():
    return uuid4().hex


db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=True)
    money = db.Column(db.Integer, default=0)
    role = db.Column(db.String(10), default='user')
    password_hash = db.Column(db.String(128), nullable=True)

    def set_password(self, password=None):
        if password:
            self.password = password
            self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.password_hash is None:
            return True
        return check_password_hash(self.password_hash, password)


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), db.ForeignKey('user.username'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(50), nullable=False)
    approved = db.Column(db.Boolean, default=False)
    pending = db.Column(db.Boolean, default=True)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
