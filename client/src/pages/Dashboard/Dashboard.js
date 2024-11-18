import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = ({ userDetails, handleLogout }) => {
  const [username] = useState(userDetails?.username || '');
  const [token] = useState(userDetails?.token || '');
  const [userFullName, setUserFullName] = useState('');
  const [message, setMessage] = useState('');
  const apiPort = process.env.REACT_APP_API_PORT || 4010;
  const apiLink = process.env.REACT_APP_API_URL || 'http://localhost';

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!username || !token) {
        setMessage('Missing username or token.');
        return;
      }

      try {
        const response = await axios.post(`${apiLink}:${apiPort}/get-user`, {
          username, token
        });

        if (response.data.success) {
          const { first_name, last_name } = response.data;
          setUserFullName(`${first_name} ${last_name}`);
        } else {
          console.error('Failed to fetch user details:', response.data.message);
          setMessage(response.data.message || 'Failed to fetch user details.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setMessage('Error fetching user details.');
      }
    };

    fetchUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, token, apiLink, apiPort]);

  return (
    <div className="page-container">
      <Header handleLogout={handleLogout} />
      <div className="content">
        {userFullName ? (
          <h1>Welcome to the Application, {userFullName}!</h1>
        ) : (
          <h1>Loading user details...</h1>
        )}
        {message && <p className="error-message">{message}</p>}
        <div className="options-container">
          <Link to="/view-database" className="option-box">
            <h2>View the Database</h2>
          </Link>
          <Link to="/upload-package" className="option-box">
            <h2>Upload a Package</h2>
          </Link>
          <Link to="/download-package" className="option-box">
            <h2>Download a Package</h2>
          </Link>
          {userDetails.is_admin && (
            <Link to="/admin-page" className="option-box">
              <h2>Admin Page</h2>
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;