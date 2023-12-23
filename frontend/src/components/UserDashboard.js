import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch user data when the component mounts
    fetch('/user_data')  // Adjust the API endpoint based on your Flask API
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
  }, []);

  const handleGainMoney = () => {
    // Send a request to the Flask API to add money
    fetch('/gain', {
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
        setReason('');
      })
      .catch((error) => {
        console.error('Error gaining money:', error);
      });
  };

  const handleLoseMoney = () => {
    // Send a request to the Flask API to deduct money
    fetch('/lose', {
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
        setReason('');
      })
      .catch((error) => {
        console.error('Error losing money:', error);
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
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <br />
        <button onClick={handleGainMoney}>Gain Money</button>
        <button onClick={handleLoseMoney}>Lose Money</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default UserDashboard;

