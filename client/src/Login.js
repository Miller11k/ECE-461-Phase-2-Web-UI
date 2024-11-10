import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const apiPort = process.env.REACT_APP_API_PORT || 4010;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
  
    const apiUrl = `http://localhost:${apiPort}/login`;
  
    try {
      const response = await axios.post(apiUrl, { username, password });
      if (response.data.success) {
        const { first_name, last_name, is_admin } = response.data;
        handleLogin({ first_name, last_name, is_admin });
      }
    } catch (err) {
      console.error(err);
      setMessage('Invalid Credentials');
    }
  };  

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;