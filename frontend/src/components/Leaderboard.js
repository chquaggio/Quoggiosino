import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import classificaIcon from './classifica.png';
import { logout, handleDeleteUser, fetchLeaderboardData } from './api.js';

const Leaderboard = ({ isAdminMode }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['quoggiosino']);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLeaderboardData();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      };
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (userUsername) => {
    try {
      const data = await handleDeleteUser(userUsername);
      if (data.success) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    };
  };

  const handleLogout = async () => {
    await logout();
    removeCookie('quoggiosino');
    navigate('/login');
  };

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
              <button onClick={() => handleDeleteUser(user.username)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button variant="light" size="lg" onClick={() => navigate('/user_dashboard')}>
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

