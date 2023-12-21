from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, request, redirect, url_for, session, jsonify

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg://casino_user:casino_password@db/casino_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "your_secret_key"

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    money = db.Column(db.Integer, default=1000)


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())


cxt = app.app_context()
cxt.push()

db.create_all()


@app.route('/')
def index():
    if 'username' in session:
        user = User.query.filter_by(username=session['username']).first()
        return render_template('index.html', username=session['username'], balance=user.money)
    return redirect(url_for('login'))


@app.route('/aggiungi', methods=['POST'])
def aggiungi():
    if 'username' in session:
        user = User.query.filter_by(username=session['username']).first()
        amount = request.json.get('amount', 0)
        if amount > 0:
            user.money += amount
            transaction = Transaction(user_id=user.id, amount=amount)
            db.session.add(transaction)
            db.session.commit()
            return jsonify({'success': True})
    return jsonify({'success': False})


@app.route('/rimuovi', methods=['POST'])
def rimuovi():
    if 'username' in session:
        user = User.query.filter_by(username=session['username']).first()
        amount = request.json.get('amount', 0)
        if amount > 0 and user.money >= amount:
            user.money -= amount
            transaction = Transaction(user_id=user.id, amount=-amount)
            db.session.add(transaction)
            db.session.commit()
            return jsonify({'success': True})
    return jsonify({'success': False})


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        user = User.query.filter_by(username=username).first()
        if user is None:
            new_user = User(username=username)
            db.session.add(new_user)
            db.session.commit()
            user = new_user

        session['username'] = username
        return redirect(url_for('index'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))


@app.route('/leaderboard')
def leaderboard():
    users = User.query.order_by(User.money.desc()).all()
    return render_template('leaderboard.html', users=users)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)

