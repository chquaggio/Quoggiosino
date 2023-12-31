import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import classificaIcon from './classifica.png';

const Leaderboard = ({ isAdminMode }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const navigate = useNavigate();
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
    navigate('/login');
  };


  useEffect(() => {
    fetchLeaderboardData();

    const intervalId = setInterval(() => {
      fetchLeaderboardData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="leaderboard-page">
      <div className="header-container">
        <img src={classificaIcon} alt="Classifica Icon" className="w-100" />
      </div>
      <br />
      <QRCode value="http://dev-home:3000" />
      <br />
      <div className="leaderboard-container">
        {leaderboardData.map((user, index) => (
          <div key={user.username} className={`leaderboard-entry ${index === 0 ? 'crowned' : ''}`}>
            <span className="entry-rank">{index + 1}.</span>
            <span className="entry-name">{user.username}</span>
            <span className="entry-balance">{user.balance}</span>
            {isAdminMode && (
              <button onClick={() => handleDeleteUser(user.id)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button variant="light" size="lg" onClick={() => navigate(`/user_dashboard?username=${encodeURIComponent(username)}`)}>
          Ritorna alla dashboard
        </Button>
      </div>
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="light" size="lg" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Leaderboard;

