const mysql = require('mysql2');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host: isProduction ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
  user: isProduction ? process.env.DB_USER : process.env.DB_USER_LOCAL,
  password: isProduction ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_LOCAL,
  database: isProduction ? process.env.DB_NAME : process.env.DB_NAME_LOCAL,
  port: isProduction ? process.env.DB_PORT : process.env.DB_PORT_LOCAL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
