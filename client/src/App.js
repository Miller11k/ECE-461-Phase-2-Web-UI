import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Upload from './pages/UploadPackage/UploadPackage';
import ViewDatabase from './pages/ViewDatabase/ViewDatabase';
import DownloadPackage from './pages/DownloadPackage/DownloadPackage';
import ExternalPackage from './pages/UploadPackage/package-types/ExternalPackage';
import InternalPackage from './pages/UploadPackage/package-types/InternalPackage';
import Account from './pages/Account/Account'; // New import for Account page

const apiPort = process.env.REACT_APP_API_PORT || 4010;
const apiLink = process.env.REACT_APP_API_URL || 'http://localhost';  

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
  
    // Store details in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userDetails', JSON.stringify(details));
  };  

  const handleLogout = async (providedUsername) => {
    const usernameToUse = providedUsername || userDetails?.username;

    try {
      await fetch(`${apiLink}:${apiPort}/delete-token`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username: usernameToUse,
              token: userDetails?.token,
          }),
      });
  } catch (error) {
      console.error('Error during logout:', error);
  }
  

    // Clear state and localStorage
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
            isLoggedIn ? <ViewDatabase handleLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/download-package"
          element={
            isLoggedIn ? <DownloadPackage handleLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/upload-package/*"
          element={
            isLoggedIn ? <Upload handleLogout={handleLogout} /> : <Navigate to="/" />
          }
        >
          <Route
            path="external-package"
            element={
              isLoggedIn ? <ExternalPackage handleLogout={handleLogout} /> : <Navigate to="/" />
            }
          />
          <Route
            path="internal-package"
            element={
              isLoggedIn ? <InternalPackage handleLogout={handleLogout} /> : <Navigate to="/" />
            }
          />
        </Route>
        <Route
          path="/account"
          element={
            isLoggedIn ? (
              <Account userDetails={userDetails} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;