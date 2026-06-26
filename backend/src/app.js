const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contractRoutes = require('./routes/contractRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: ['https://freelamz-frontend.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Mapa de utilizadores online: userId -> socketId
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Utilizador conectado:', socket.id);

  // Utilizador identifica-se
  socket.on('user:join', (userId) => {
    onlineUsers.set(String(userId), socket.id);
    console.log(`Utilizador ${userId} online`);
    // Envia lista de utilizadores online
    io.emit('users:online', Array.from(onlineUsers.keys()));
  });

  // Nova mensagem em tempo real
  socket.on('message:send', (data) => {
    const { receiver_id, message } = data;
    const receiverSocket = onlineUsers.get(String(receiver_id));
    if (receiverSocket) {
      io.to(receiverSocket).emit('message:new', message);
    }
  });

  // Nova proposta
  socket.on('proposal:send', (data) => {
    const { client_id, proposal } = data;
    const clientSocket = onlineUsers.get(String(client_id));
    if (clientSocket) {
      io.to(clientSocket).emit('notification:new', {
        type: 'proposal',
        title: 'Nova proposta recebida!',
        body: `${proposal.freelancer_name} enviou uma proposta para o teu projecto.`,
        url: '/client-dashboard',
      });
    }
  });

  // Desconexão
  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('users:online', Array.from(onlineUsers.keys()));
    console.log('Utilizador desconectado:', socket.id);
  });
});

// Exporta io para usar nos controllers
app.set('io', io);

// CORS
app.use(cors({
  origin: ['https://freelamz-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Freelamz API Online!', status: 'OK', onlineUsers: onlineUsers.size });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contracts', contractRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Freelamz a correr na porta ${PORT}`);
});

module.exports = { app, io };