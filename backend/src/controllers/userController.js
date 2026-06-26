const pool = require('../config/db');

const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, role, bio, skills, phone, location, avatar, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador nao encontrado.' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Erro no perfil:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, bio, skills, phone, location } = req.body;
  try {
    const user = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), bio = COALESCE($2, bio), skills = COALESCE($3, skills), phone = COALESCE($4, phone), location = COALESCE($5, location) WHERE id = $6 RETURNING id, name, email, role, bio, skills, phone, location, avatar',
      [name, bio, JSON.stringify(skills), phone, location, req.user.id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Erro ao actualizar perfil:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getFreelancers = async (req, res) => {
  try {
    const freelancers = await pool.query(
      "SELECT id, name, email, bio, skills, location, avatar, created_at FROM users WHERE role = 'freelancer' ORDER BY created_at DESC"
    );
    res.json(freelancers.rows);
  } catch (err) {
    console.error('Erro ao buscar freelancers:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, name, email, role, bio, skills, location, avatar, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users.rows);
  } catch (err) {
    console.error('Erro ao buscar utilizadores:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Utilizador removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover utilizador:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { getProfile, updateProfile, getFreelancers, getAllUsers, deleteUser };