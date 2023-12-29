from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, abort
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg://casino_user:casino_password@db/casino_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
app.secret_key = "your_secret_key"

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=True)
    money = db.Column(db.Integer, default=1000)
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


cxt = app.app_context()
cxt.push()

db.create_all()


admin_user = User.query.filter_by(username='quoggio').first()

if not admin_user:
    admin_user = User(username='quoggio', role='admin')
    admin_user.set_password('belando')
    db.session.add(admin_user)
    db.session.commit()


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password', '')

    user = User.query.filter_by(username=username).first()

    if not user:
        new_user = User(username=username)
        db.session.add(new_user)
        new_user.set_password(password)
        db.session.commit()
        user = new_user

    if user.check_password(password):
        return jsonify({'success': True, 'role': user.role})
    else:
        return jsonify({'success': False, 'error': 'Incorrect password'})
    return jsonify({'success': True})


@app.route('/user_data', methods=['GET', 'OPTIONS', 'POST'])
@cross_origin(supports_credentials=True)
def user_data():
    data = request.json
    if 'username' in data:
        user = User.query.filter_by(username=data['username']).first()
        if user:
            return jsonify({'username': user.username, 'balance': user.money})

    return jsonify({'error': 'User not found'}), 404


@app.route('/delete_user/<int:user_id>', methods=['GET', 'DELETE', 'OPTIONS', 'POST'])
@cross_origin(supports_credentials=True)
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'success': True})
    abort(403)  # Forbidden


@app.route('/approve_transaction/<int:transaction_id>', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def approve_transaction(transaction_id):
    data = request.json
    decision = data.get('decision')
    transaction = Transaction.query.get(transaction_id)
    user = User.query.filter_by(username=transaction.username).first()
    if transaction:
        if decision == 'approve':
            transaction.approved = True
            user.money += transaction.amount
            transaction.pending = False
            db.session.commit()
            return jsonify({'success': True})
        elif decision == 'deny':
            transaction.approved = False
            transaction.pending = False
            db.session.commit()
            return jsonify({'success': True})
    abort(403)  # Forbidden


@app.route('/transaction', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def transaction():
    if request.method == 'GET':
        # Get all transactions
        transactions = Transaction.query.filter_by(pending=True).all()
        transaction_data = []
        for transaction in transactions:
            transaction_data.append({
                'id': transaction.id,
                'username': transaction.username,
                'amount': transaction.amount,
                'reason': transaction.reason,
                'pending': transaction.pending,
                'approved': transaction.approved,
                'timestamp': transaction.timestamp.isoformat(),
            })
        return jsonify({'transactions': transaction_data})
    data = request.get_json()
    username = data.get('username')
    amount = data.get('amount')
    reason = data.get('reason')

    new_transaction = Transaction(username=username, amount=amount, reason=reason)
    db.session.add(new_transaction)
    db.session.commit()

    created_transaction = Transaction.query.filter_by(id=new_transaction.id).first()

    if created_transaction:
        transaction_data = {
            'id': created_transaction.id,
            'username': created_transaction.username,
            'amount': created_transaction.amount,
            'reason': created_transaction.reason,
            'pending': created_transaction.pending,
            'approved': created_transaction.approved,
            'timestamp': created_transaction.timestamp.isoformat(),
        }

        return jsonify({"message": "Transaction created", "transaction": transaction_data}), 200

    return jsonify({"error": "Failed to fetch transaction details"}), 500


@app.route('/leaderboard', methods=['GET', 'OPTIONS', 'POST'])
@cross_origin(supports_credentials=True)
def leaderboard():
    users = User.query.order_by(User.money.desc()).all()

    leaderboard_data = [{'id': user.id, 'username': user.username, 'balance': user.money} for user in users]

    return jsonify({'leaderboard': leaderboard_data})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)

