const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const createTables = require('./initDb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Criar tabelas
createTables();

// Rotas
const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', gigRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Freelamz API a funcionar!' });
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
  console.log('Base de dados conectada!');
});
