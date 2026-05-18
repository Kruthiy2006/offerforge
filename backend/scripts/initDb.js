const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('🔧 Initializing OfferForge database...\n');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schema);
    console.log('✅ Database schema created successfully');

    // Read and execute seed data
    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seed);
    console.log('✅ Sample data inserted successfully');

    console.log('\n🎉 Database initialization complete!');
    console.log('   Database: offerforge');
    console.log('   Tables: candidates, templates, offers, offer_status_logs');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️  Sample data already exists, skipping seed...');
    } else {
      console.error('❌ Database initialization failed:', err.message);
      process.exit(1);
    }
  } finally {
    await connection.end();
  }
}

initDatabase();
