import React from 'react';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import './searchForPackage.css';

const DownloadPage = ({ handleLogout }) => {
  return (
    <div className="page-container">
      <Header handleLogout={handleLogout} />
      <div className="content">
        <h1>Search For A Package Page</h1>
      </div>
      <Footer />
    </div>
  );
};

export default DownloadPage;