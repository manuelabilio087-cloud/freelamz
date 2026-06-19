const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = 'C:\\Users\\Dell laptop\\Desktop\\freelamz\\database\\freelamz.db';
const schemaPath = 'C:\\Users\\Dell laptop\\Desktop\\freelamz\\database\\schema.sql';

console.log('Caminho da BD:', dbPath);
console.log('Caminho do schema:', schemaPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao criar a base de dados:', err.message);
    return;
  }
  console.log('Base de dados criada!');
});

const schema = fs.readFileSync(schemaPath, 'utf8');
const statements = schema.split(';').filter(s => s.trim());

db.serialize(() => {
  statements.forEach((statement) => {
    if (statement.trim()) {
      db.run(statement + ';', (err) => {
        if (err) {
          console.error('Erro:', err.message);
        }
      });
    }
  });
});

db.close(() => {
  console.log('Tabelas criadas com sucesso!');
});
