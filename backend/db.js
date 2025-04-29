const mysql = require('mysql2');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host: isLocalhost ? process.env.DB_HOST_LOCAL : process.env.DB_HOST,  
  user: isLocalhost ? process.env.DB_USER_LOCAL : process.env.DB_USER,  
  password: isLocalhost ? process.env.DB_PASSWORD_LOCAL : process.env.DB_PASSWORD, 
  database: isLocalhost ? process.env.DB_NAME_LOCAL : process.env.DB_NAME,  
  port: isLocalhost ? process.env.DB_PORT_LOCAL : process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
