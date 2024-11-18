import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Account.module.css';

const Account = ({ userDetails, handleLogout }) => {
  const [username] = useState(userDetails?.username || '');
  const [token] = useState(userDetails?.token || '');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');
  const [userFullName, setUserFullName] = useState('');


  const apiPort = process.env.REACT_APP_API_PORT || 4010;
  const apiLink = process.env.REACT_APP_API_URL || 'http://localhost';

  useEffect(() => {
    const authenticateUser = async () => {
      if (!username || !token) {
        return;
      }
  
      try {
        const authResponse = await axios.post(`${apiLink}:${apiPort}/authenticate`, {
          username,
          token,
        });
  
        if (authResponse.data.success) {
          setIsAuthenticated(true);
  
          const userResponse = await axios.post(`${apiLink}:${apiPort}/get-user`, {
            username, token
          });
  
          if (userResponse.data.success) {
            const { first_name, last_name } = userResponse.data;
            setUserFullName(`${first_name} ${last_name}`);
          } else {
            setMessage('Failed to load user details.');
            console.error('Failed to fetch user details.');
          }
        } else {
          setMessage('Invalid token. Please log in again.');
          console.warn('Invalid token, logging out.');
          handleLogout();
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setMessage('Error during authentication. Please log in again.');
        handleLogout();
      }
    };
  
    authenticateUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, token, apiLink, apiPort, handleLogout]);  

  const handleSaveChanges = async () => {
  
    if (selectedOption === 'username' && newUsername) {
      try {
        const response = await axios.post(`${apiLink}:${apiPort}/change-username`, {
          currentUsername: username,
          token, // Use the token for authentication
          newUsername,
        });
  
        if (response.data.success) {
          alert('Username updated successfully');
  
          // Update localStorage and userDetails with the new username
          const updatedUserDetails = { ...userDetails, username: newUsername };
          localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
  
          // Pass the updated username to handleLogout
          handleLogout(newUsername);
        } else {
          alert(response.data.message || 'Failed to update username');
        }
      } catch (error) {
        console.error('Error updating username:', error);
        alert('An error occurred while updating the username');
      }
    } else if (selectedOption === 'password' && newPassword && newPassword === confirmPassword) {
      try {
        const response = await axios.post(`${apiLink}:${apiPort}/change-password`, {
          username, // Pass current username
          token, // Use the token for authentication
          currentPassword: userDetails.currentPassword, // Pass current password if needed
          newPassword,
        });
  
        if (response.data.success) {
          alert('Password updated successfully');
          handleLogout(); // Logout after successful password update
        } else {
          alert(response.data.message || 'Failed to update password');
        }
      } catch (error) {
        console.error('Error updating password:', error);
        alert('An error occurred while updating the password');
      }
    } else {
      console.warn('Invalid form submission. Check fields.');
      alert('Please ensure all fields are filled correctly.');
    }
  };  

  return (
    <div className={styles.accountContainer}>
      {isAuthenticated ? (
        <>
          <h1 className={styles.title}>Account Details for {userFullName}</h1>
          <div className={styles.options}>
            <button
              className={`${styles.optionButton} ${selectedOption === 'username' ? styles.selected : ''}`}
              onClick={() => setSelectedOption('username')}
            >
              Change Username
            </button>
            <button
              className={`${styles.optionButton} ${selectedOption === 'password' ? styles.selected : ''}`}
              onClick={() => setSelectedOption('password')}
            >
              Change Password
            </button>
          </div>

          {selectedOption === 'username' && (
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="newUsername">New Username</label>
              <input
                type="text"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className={styles.input}
                placeholder="Enter new username"
              />
            </div>
          )}

          {selectedOption === 'password' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Enter new password"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Confirm new password"
                />
              </div>
            </>
          )}
          <button onClick={handleSaveChanges} type="button" className={styles.saveButton}>Save Changes</button>
        </>
      ) : (
        <p className={styles.errorMessage}>{message || 'Authenticating...'}</p>
      )}
    </div>
  );
};

export default Account;