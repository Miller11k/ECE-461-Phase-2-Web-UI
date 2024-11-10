const express = require('express');
const { Client } = require('pg');
// const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
// dotenv.config();

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
    rejectUnauthorized: false, // Consider using appropriate SSL certificates for production.
  },
});


console.log('Client Configuration:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`User: ${process.env.DB_USER}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`Port: ${process.env.DB_PORT || '5432'}`);
console.log(`SSL rejectUnauthorized: ${client.ssl.rejectUnauthorized}`);

// Connect to the database
const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to the RDS database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
  }
};

connectToDatabase();

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query to check if credentials are valid and retrieve user details
    const result = await client.query(
      'SELECT first_name, last_name, is_admin FROM public.employee_logins WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const { first_name, last_name, is_admin } = result.rows[0];
      res.json({ success: true, first_name, last_name, is_admin });
    } else {
      res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error('Error checking credentials:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
  

// Start the server
const PORT = process.env.REACT_APP_API_PORT; // Use the REACT_APP_API_PORT variable, default to 4010 if not set
console.log("Port read", PORT);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});