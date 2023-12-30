from flask_session import Session


class ApplicationConfig:
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg://casino_user:casino_password@db/casino_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SECRET_KEY = "d8fg7ds89f6d9hv"

    SESSION_TYPE = 'sqlalchemy'


server_session = Session()
