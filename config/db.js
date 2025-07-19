const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // No longer need backticks since DB_NAME has no spaces
    database: process.env.DB_NAME, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// A quick test to see if the connection is successful on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Successfully connected to the database.');
        connection.release(); // release the connection back to the pool
    })
    .catch(err => {
        console.error('❌ DATABASE CONNECTION FAILED');
        console.error(`Error: ${err.message}`);
        console.error('Please check your .env file and ensure the database and tables have been created by running schema.sql.');
    });

module.exports = pool;