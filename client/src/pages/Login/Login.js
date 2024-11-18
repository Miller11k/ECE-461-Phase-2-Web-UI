import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const apiPort = process.env.REACT_APP_API_PORT || 4010;
  const apiLink = process.env.REACT_APP_API_URL || 'http://localhost';  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const apiUrl = `${apiLink}:${apiPort}/login`;
    try {
      const response = await axios.post(apiUrl, { username, password });
      if (response.data.success) {
        const { token, username: returnedUsername } = response.data; // Extract username from API response
        
        // Save username and token in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', returnedUsername);
        
        // Pass both username and token to handleLogin
        handleLogin({ username: returnedUsername, token });
      }
    } catch (err) {
      console.error(err);
      setMessage('Invalid Credentials');
    }
  };
  
  return (
    <div className="login-container">
  <h1 className="login-header"><u>Login</u></h1>
  <div className="login-box">
    <div className="logo-container">
      <img src="logo.png" alt="Company Logo" className="company-logo" />
    </div>
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
