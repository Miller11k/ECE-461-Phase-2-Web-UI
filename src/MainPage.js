import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
  return (
    <div className="main-page">
      <h1>Welcome to the Application</h1>
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
    </div>
  );
}

export default MainPage;