const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const register = (req, res) => {
  const { name, email, password, role } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
    }
    if (user) {
      return res.status(400).json({ message: 'Email ja registado.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'freelancer'],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
        }

        const newUser = {
          id: this.lastID,
          name,
          email,
          role: role || 'freelancer'
        };

        const token = jwt.sign(
          { id: newUser.id, role: newUser.role },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({ user: newUser, token });
      }
    );
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha incorrectos.' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou senha incorrectos.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
  });
};

module.exports = { register, login };
