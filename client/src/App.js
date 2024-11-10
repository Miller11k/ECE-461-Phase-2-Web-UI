import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Upload from './Upload';
import ViewDatabase from './ViewDatabase';
import DownloadPackage from './DownloadPackage';
import ExternalPackage from './package-types/ExternalPackage';
import InternalPackage from './package-types/InternalPackage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userDetails, setUserDetails] = useState(() => {
    const storedUser = localStorage.getItem('userDetails');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogin = (details) => {
    setIsLoggedIn(true);
    setUserDetails(details);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userDetails', JSON.stringify(details));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserDetails(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userDetails');
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Login handleLogin={handleLogin} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard userDetails={userDetails} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/view-database"
          element={
            isLoggedIn ? <ViewDatabase /> : <Navigate to="/" />
          }
        />
        <Route
          path="/download-package"
          element={
            isLoggedIn ? <DownloadPackage /> : <Navigate to="/" />
          }
        />
        <Route
          path="/upload-package/*"
          element={
            isLoggedIn ? <Upload /> : <Navigate to="/" />
          }
        >
          <Route
            path="external-package"
            element={
              isLoggedIn ? <ExternalPackage /> : <Navigate to="/" />
            }
          />
          <Route
            path="internal-package"
            element={
              isLoggedIn ? <InternalPackage /> : <Navigate to="/" />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;