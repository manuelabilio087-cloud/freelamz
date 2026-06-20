const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.connect()
  .then(() => console.log('Base de dados conectada!'))
  .catch(err => console.error('Erro na base de dados:', err.message));

module.exports = pool;
