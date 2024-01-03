import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import leaderboardIcon from './podium.png';
import saldoIcon from './saldo.png';

const UserDashboard = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['quoggiosino']);
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const { search } = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');

  const handleButtonClick = (action) => {
    setSelectedReason(action);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://dev-home:5000/user_data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setBalance(data.balance);
        } else {
          console.error('Error fetching user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleTransaction = (transactionType) => {
    // Send a request to the Flask API
    fetch('http://dev-home:5000/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount) * (transactionType === 'gain' ? 1 : -1),
        reason: selectedReason,
      }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setAmount('');
      })
      .catch((error) => {
        console.error(`Error ${transactionType} money:`, error);
      });
    setShowModal(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('http://dev-home:5000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      removeCookie('quoggiosino');
      navigate('/login');

    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Card className="text-dark bg-light py-4" style={{ width: '100%', maxWidth: '300px' }}>
        <img src={saldoIcon} alt="Casino Icon" className="mb-1 w-100" />

        <div className="balance-container row">
          {balance.toString().split('').map((digit, index) => (
            <div key={index} className="col">
              {digit}
            </div>
          ))}
        </div>
        <br />
        <br />

        <div className="button-container">
          <Button variant="outline-light" size="lg" onClick={() => handleButtonClick('Schedina')}>Schedina</Button>
          <Button variant="outline-light" size="lg" onClick={() => handleButtonClick('Ruota della fortuna')}>Ruota della fortuna</Button>
          <Button variant="outline-light" size="lg" onClick={() => handleButtonClick('Penitenza')}>Penitenza</Button>
          <Button variant="outline-light" size="lg" onClick={() => handleButtonClick('Giochi')}>Giochi</Button>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button variant="dark" size="lg" onClick={() => navigate('/leaderboard')}>
            Vai alla classifica <img src={leaderboardIcon} alt="Leaderboard Icon" className="leaderboard-icon" />
          </Button>
        </div>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button variant="light" size="lg" onClick={handleLogout}>
            Logout
          </Button>
        </div>


        {/* Modal for input */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton style={{ color: 'black' }}>
            <Modal.Title>{selectedReason}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formNumber">
                <Form.Label style={{ color: 'black' }}>Inserisci la transazione:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Piazza i soldi qui"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => handleTransaction('gain')}>
              Guadagno
            </Button>
            <Button variant="danger" onClick={() => handleTransaction('lose')}>
              Perdita
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </div>
  );
};

export default UserDashboard;

