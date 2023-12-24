import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://dev-home:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.role === 'admin') {
          history.push(`/admin_dashboard?username=${encodeURIComponent(username)}`);
        } else {
          history.push(`/user_dashboard?username=${encodeURIComponent(username)}`);
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
    <div>
      <h1>Login</h1>
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <br />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <br />
      <button type="button" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

