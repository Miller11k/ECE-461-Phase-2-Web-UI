import React from 'react';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import './DownloadPackage.css';

const DownloadPage = ({ handleLogout }) => {
  return (
    <div className="page-container">
      <Header handleLogout={handleLogout} />
      <div className="content">
        <h1>Download Page</h1>
      </div>
      <Footer />
    </div>
  );
};

export default DownloadPage;