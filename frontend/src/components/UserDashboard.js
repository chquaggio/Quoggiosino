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
  const reasons = ['Schedina', 'Ruota della fortuna', 'Fogli sul muro', 'Limone con Lucio'];

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch('http://dev-home:5000/user_data', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: usernameFromParams,
          }),
        });

        if (!isMounted) {
          return; // Avoid state update on unmounted component
        }

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('User data:', data);
        setUsername(data.username);
        setBalance(data.balance);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Set to false when component is unmounted
    };
  }, [usernameFromParams]);

  const handleTransaction = (transactionType) => {
    // Send a request to the Flask API
    fetch('http://dev-home:5000/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        amount: parseFloat(amount) * (transactionType === 'gain' ? 1 : -1),
        reason: selectedReason,
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
        console.error(`Error ${transactionType} money:`, error);
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
  const handleLogout = () => {
    // history.push('/login');
  };

   return (
    <div>
      <h1>Benvenuto, {username}!</h1>
      <p>Il tuo saldo: {balance}</p>
      <div>
        <h2>Gestione transazioni</h2>
        <label>
          Ammontare:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <br />
        <label>
          Motivo:
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
        <button onClick={() => handleTransaction('gain')}>Guadagno</button>
        <button onClick={() => handleTransaction('lose')}>Perdita</button>
      </div>
      <Link to={`/leaderboard?username=${encodeURIComponent(username)}`}>Vai alla classifica</Link>
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;

