import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import casinoIcon from './casino-icon.png';
import casinoLogin from './casino_title.png';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://dev-home:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data)

      if (data.success) {
        if (data.role === 'admin') {
          navigate('/admin_dashboard')
        } else {
          navigate('/user_dashboard')
        }
        console.log('Login successful!');
      } else {
        console.error('Login failed.');
          if (data.error === 'Incorrect password') {
          alert('Incorrect password. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Card className="text-dark bg-light py-4" style={{ width: '100%', maxWidth: '300px' }}>
        <img src={casinoIcon} alt="Casino Icon" className="mb-3" />
        <img src={casinoLogin} alt="Casino Icon" className="mb-3 w-100" />

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3 w-100">
            <Form.Label>NOME</Form.Label>
            <Form.Control
              type="text"
              placeholder="Scegli il tuo nome utente"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100">
            <Form.Label>PASSWORD (NON COMPILARE)</Form.Label>
            <Form.Control
              type="password"
              placeholder="NON COMPILARE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="button-container">
            <Button variant="warning" type="submit">
              Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

