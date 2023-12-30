from flask import Flask
from config import ApplicationConfig
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
    app.config.from_object(ApplicationConfig)

    from models import db, User
    db.init_app(app)
    app.config['SESSION_SQLALCHEMY'] = db
    app.config['SESSION_SQLALCHEMY_TABLE'] = 'sessions'

    from config import server_session
    server_session.init_app(app)

    with app.app_context():
        db.metadata.clear()
        db.create_all()
        admin_user = User.query.filter_by(username='quoggio').first()

        if not admin_user:
            admin_user = User(username='quoggio', role='admin')
            admin_user.set_password('belando')
            db.session.add(admin_user)
            db.session.commit()

    return app


app = create_app()


@app.route('/')
def health_check():
    return 'OK'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)
