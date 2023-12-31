from flask import request, jsonify, abort, session
from models import db, User, Transaction
from flask_cors import cross_origin
from flaskr import create_app

app = create_app()


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

    session['user_id'] = user.id
    if user.check_password(password):
        return jsonify({'success': True, 'role': user.role, 'id': user.id})
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


@app.route('/delete_user/<username>', methods=['GET', 'DELETE', 'OPTIONS', 'POST'])
@cross_origin(supports_credentials=True)
def delete_user(username):
    user = User.query.get(username).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'success': True})
    abort(403)


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

