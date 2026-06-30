const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contractRoutes = require('./routes/contractRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const gigRoutes = require('./routes/gigRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const affiliateRoutes = require('./routes/affiliateRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://freelamz-frontend.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('Utilizador conectado:', socket.id);

  socket.on('user:join', (userId) => {
    onlineUsers.set(String(userId), socket.id);
    io.emit('users:online', Array.from(onlineUsers.keys()));
  });

  socket.on('message:send', (data) => {
    const { receiver_id, message } = data;
    const receiverSocket = onlineUsers.get(String(receiver_id));
    if (receiverSocket) {
      io.to(receiverSocket).emit('message:new', message);
    }
  });

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

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('users:online', Array.from(onlineUsers.keys()));
  });
});

app.set('io', io);

app.use(cors({
  origin: ['https://freelamz-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Demasiados pedidos. Tenta novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting apertado para auth (login/registo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Demasiadas tentativas de autenticacao. Tenta em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

app.get('/', (req, res) => {
  res.json({ message: 'Freelamz API Online!', status: 'OK', onlineUsers: onlineUsers.size });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Servidor Freelamz a correr na porta ${PORT}`);
});

module.exports = { app, io };