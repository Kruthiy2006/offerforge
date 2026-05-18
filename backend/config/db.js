const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'offerforge',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully to database:', process.env.DB_NAME || 'offerforge');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('Please ensure MySQL is running and the database "offerforge" exists.');
    console.error('Run: mysql -u root -e "CREATE DATABASE IF NOT EXISTS offerforge;"');
    console.error('Then run: npm run db:init');
  }
})();

module.exports = pool;
