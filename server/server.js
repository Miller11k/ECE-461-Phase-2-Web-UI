const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
require('./package.json');

// Import password helper functions
const { createSalt, generatePassword, validatePassword} = require('./passwordHelper.js');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Create a client for PostgreSQL connection
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  ssl: {
    rejectUnauthorized: false,
  },
});

const employeeDB = process.env.DB_SCHEMA + "." +  process.env.DB_TABLE;

// console.log('Client Configuration:');
// console.log(`Host: ${process.env.DB_HOST}`);
// console.log(`User: ${process.env.DB_USER}`);
// console.log(`Database: ${process.env.DB_NAME}`);
// console.log(`Port: ${process.env.DB_PORT || '5432'}`);
// console.log(`SSL rejectUnauthorized: ${client.ssl.rejectUnauthorized}`);
// console.log(`Employee Database = ${employeeDB}`);

// Connect to the database
const connectToDatabase = async () => {
  try {
    await client.connect();
    // console.log('Connected to the RDS database successfully.');
  } catch (error) {
    // console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
};

connectToDatabase();

app.post('/create-user', async (req, res) => {
  const {first_name, last_name, username, plaintext_password, is_admin} = req.body;

  let salt = createSalt();
  let cipher_password = generatePassword(plaintext_password, salt);

  try {
    const result = await client.query(
      `INSERT into ${employeeDB} (username, password, salt, first_name, last_name, is_admin) VALUES ($1, $2, $3, $4, $5, $6)`,
    [username, cipher_password, salt, first_name, last_name, is_admin]
    );
    res.json({success: true});

  } catch (error) {
    // console.error('Error adding user:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query to get user details along with the salt
    const result = await client.query(
      `SELECT first_name, last_name, is_admin, salt, password FROM ${employeeDB} WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      // No user found
      return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    // Extract the user details
    const { first_name, last_name, is_admin, salt, password: storedPassword } = result.rows[0];

    // Validate the password using the salt
    const isValid = validatePassword(password, storedPassword, salt);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid Password' });
    }

    // Return success response if validation passes
    res.json({ success: true, first_name, last_name, is_admin });
  } catch (error) {
    // console.error('Error during login:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/change-username', async (req, res) => {
  const { currentUsername, currentPassword, newUsername } = req.body;

  try {
    const result = await client.query(
      `SELECT first_name, last_name, is_admin, salt, password FROM ${employeeDB} WHERE username = $1`,
      [currentUsername]
    );

    if (result.rows.length === 0) {
      // No user found
      return res.status(401).json({ success: false, message: 'Invalid Username' });
    }

    // Extract the user details
    const { first_name, last_name, is_admin, salt, password: storedPassword } = result.rows[0];

    // Validate the password using the salt
    const isValid = validatePassword(currentPassword, storedPassword, salt);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid Password' });
    }

    // Step 3: Update the username
    const updateResult = await client.query(
      `UPDATE ${employeeDB} SET username = $1 WHERE username = $2`,
      [newUsername, currentUsername]
    );

    // Check if any row was updated
    if (updateResult.rowCount === 0) {
      // console.log('Failed to update username in the database.');
      return res.status(500).json({ success: false, message: 'Failed to update username' });
    }

    // console.log(`Username updated successfully from ${currentUsername} to ${newUsername}.`);
    res.json({ success: true, message: 'Username updated successfully' });
  } catch (error) {
    // console.error('Error updating username:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Endpoint to change password
app.post('/change-password', async (req, res) => {
  const { currentUsername, currentPassword, newPassword } = req.body;

  try {
    const result = await client.query(
      `SELECT * FROM ${employeeDB} WHERE username = $1`,
      [currentUsername]
    );

    if (result.rows.length === 0) {
      // No user found
      return res.status(401).json({ success: false, message: 'Invalid Username' });
    }
    

    // Extract the user details
    const { first_name, last_name, is_admin, salt, password: storedPassword } = result.rows[0];

    // Validate the password using the salt
    const isValid = validatePassword(currentPassword, storedPassword, salt);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid Password' });
    }

    const new_hashed_password = generatePassword(newPassword, salt);
    

    // Update the password
    await client.query(
      `UPDATE ${employeeDB} SET password = $1 WHERE username = $2`,
      [new_hashed_password, currentUsername]
    );

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    // console.error('Error updating password:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.REACT_APP_API_PORT || 4010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});