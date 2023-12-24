import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [message, setMessage] = useState('');
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const usernameFromParams = params.get('username');
  const reasons = ['Salary', 'Bonus', 'Expense', 'Other'];

  useEffect(() => {
  fetch('http://dev-home:5000/user_data', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: usernameFromParams,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('User data:', data);
      setUsername(data.username);
      setBalance(data.balance);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
}, [usernameFromParams]);

  const handleGainMoney = () => {
    // Send a request to the Flask API to add money
    fetch('http://dev-home:5000/gain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        amount: parseFloat(amount),
        reason: reason,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setAmount('');
        setSelectedReason('');
        fetchUserData();
      })
      .catch((error) => {
        console.error('Error gaining money:', error);
      });
  };

  const handleLoseMoney = () => {
    // Send a request to the Flask API to deduct money
    fetch('http://dev-home:5000/lose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        amount: parseFloat(amount),
        reason: reason,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setAmount('');
        setSelectedReason('');
        fetchUserData();
      })
      .catch((error) => {
        console.error('Error losing money:', error);
      });
  };
  const fetchUserData = () => {
    // Fetch user data when the component mounts
    fetch('http://dev-home:5000/user_data', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameFromParams,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Updated user data:', data);
        setUsername(data.username);
        setBalance(data.balance);
      })
      .catch((error) => {
        console.error('Error fetching updated user data:', error);
      });
  };

   return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Your balance: {balance}</p>
      <div>
        <h2>Transaction</h2>
        <label>
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <br />
        <label>
          Reason:
          <div>
            {reasons.map((reason) => (
              <label key={reason}>
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                />
                {reason}
              </label>
            ))}
          </div>
        </label>
        <br />
        <button onClick={handleGainMoney}>Gain Money</button>
        <button onClick={handleLoseMoney}>Lose Money</button>
      </div>
      <Link to="/leaderboard">Vai alla leaderboard</Link>
    </div>
  );
};

export default UserDashboard;

