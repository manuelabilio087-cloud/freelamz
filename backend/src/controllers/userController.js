const db = require('../config/db');

const getProfile = (req, res) => {
  db.get(
    'SELECT id, name, email, role, bio, skills, avatar, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      if (!user) {
        return res.status(404).json({ message: 'Utilizador nao encontrado.' });
      }
      res.json(user);
    }
  );
};

const updateProfile = (req, res) => {
  const { name, bio, skills, avatar } = req.body;

  db.run(
    'UPDATE users SET name = ?, bio = ?, skills = ?, avatar = ? WHERE id = ?',
    [name, bio, skills, avatar, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      db.get(
        'SELECT id, name, email, role, bio, skills, avatar FROM users WHERE id = ?',
        [req.user.id],
        (err, user) => {
          if (err) {
            return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
          }
          res.json(user);
        }
      );
    }
  );
};

const getFreelancers = (req, res) => {
  db.all(
    'SELECT id, name, bio, skills, avatar FROM users WHERE role = ?',
    ['freelancer'],
    (err, freelancers) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      res.json(freelancers);
    }
  );
};

module.exports = { getProfile, updateProfile, getFreelancers };
