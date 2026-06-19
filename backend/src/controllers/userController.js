const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, role, bio, skills, avatar, created_at FROM users WHERE id = \',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, bio, skills, avatar } = req.body;

  try {
    const updated = await pool.query(
      'UPDATE users SET name = \, bio = \, skills = \, avatar = \ WHERE id = \ RETURNING id, name, email, role, bio, skills, avatar',
      [name, bio, skills, avatar, req.user.id]
    );

    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getFreelancers = async (req, res) => {
  try {
    const freelancers = await pool.query(
      'SELECT id, name, bio, skills, avatar FROM users WHERE role = \',
      ['freelancer']
    );

    res.json(freelancers.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { getProfile, updateProfile, getFreelancers };
