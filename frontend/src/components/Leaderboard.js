import React, { useEffect, useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import QRCode from 'qrcode.react';

const Leaderboard = ({ isAdminMode }) => {
  const history = useHistory();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username');

  const fetchLeaderboardData = () => {
    // Fetch leaderboard data
    fetch('http://dev-home:5000/leaderboard', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard data:', data);
        setLeaderboardData(data.leaderboard);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard data:', error);
      });
  };

  const handleDeleteUser = (userId) => {
    fetch(`http://dev-home:5000/delete_user/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('User deleted:', data);
        // Refresh leaderboard data after deletion
        fetchLeaderboardData();
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };
  const handleLogout = () => {
    history.push('/login');
  };


  useEffect(() => {
    fetchLeaderboardData();

    const intervalId = setInterval(() => {
      fetchLeaderboardData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Classifica</h1>
      <QRCode value="http://dev-home:3000" />
      <ol>
        {leaderboardData.map((user) => (
          <li key={user.username} style={{ marginBottom: '10px' }}>
            <span>
              {user.username}: {user.balance}
            </span>
            {isAdminMode && (
              <button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            )}
          </li>
        ))}
      </ol>
    <Link to={`/user_dashboard?username=${encodeURIComponent(username)}`}>
      Ritorna alla dashboard
    </Link>
    <br />
    <br />
    <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Leaderboard;

