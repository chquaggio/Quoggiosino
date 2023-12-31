import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import leaderboardIcon from './podium.png';
import saldoIcon from './saldo.png';

const UserDashboard = () => {
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [message, setMessage] = useState('');
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const usernameFromParams = params.get('username');
  const reasons = ['Schedina', 'Ruota della fortuna', 'Fogli sul muro', 'Limone con Lucio'];
  const [inputNumber, setInputNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  const handleButtonClick = (action) => {
    setSelectedAction(action);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    console.log('Input Number:', inputNumber);
    console.log('Selected Action:', selectedAction);

    setShowModal(false);
  };

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
        reason: selectedAction,
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
    setShowModal(false);
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
    navigate('/login');
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
          <Button variant="dark" size="lg" onClick={() => navigate(`/leaderboard?username=${encodeURIComponent(username)}`)}>
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
            <Modal.Title>{selectedAction}</Modal.Title>
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

