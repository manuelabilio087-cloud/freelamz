const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', '..', 'database');
const dbPath = path.join(dbDir, 'freelamz.db');

// Criar a pasta database se nao existir
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir a base de dados:', err.message);
  } else {
    console.log('Base de dados SQLite conectada em:', dbPath);
  }
});

module.exports = db;
