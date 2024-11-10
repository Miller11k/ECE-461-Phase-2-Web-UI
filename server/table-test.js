const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

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

// Connect to the database and fetch tables, columns, and data
const fetchDatabaseInfo = async () => {
  try {
    await client.connect();
    console.log('Connected to the RDS database successfully.');

    // Query to get all tables in the current database
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const tables = tablesResult.rows.map(row => row.table_name);

    const tableDetails = {};

    for (const table of tables) {
      // Query to get all columns for the current table
      const columnsResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = $1
      `, [table]);

      const columns = columnsResult.rows.map(row => row.column_name);

      // Query to get all values for the current table
      const valuesResult = await client.query(`SELECT * FROM ${table}`);

      tableDetails[table] = {
        columns: columns,
        values: valuesResult.rows,
      };
    }

    console.log(JSON.stringify(tableDetails, null, 2)); // Display the full structure in the console

    // Close the database connection
    await client.end();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error retrieving tables, columns, or data:', error.message);
    await client.end();
    console.error('Database connection closed due to an error.');
  }
};

// Run the function to fetch and display database info
fetchDatabaseInfo();