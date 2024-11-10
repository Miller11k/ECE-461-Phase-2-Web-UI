import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ userDetails, handleLogout }) => {
  return (
    <div className="main-page">
      <h1>Welcome to the Application, {userDetails.first_name} {userDetails.last_name}!</h1>
      {userDetails.is_admin && <p>You are logged in as an admin.</p>}
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
      </div>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Dashboard;
