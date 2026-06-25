const pool = require('../config/db');

const createProject = async (req, res) => {
  const { title, description, budget, category, deadline, image_url } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO projects (title, description, budget, category, deadline, image_url, client_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, budget, category, deadline || null, image_url || null, req.user.id]
    );

    const project = result.rows[0];

    // Buscar o nome do cliente
    const clientResult = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.id]
    );

    res.status(201).json({
      ...project,
      client_name: clientResult.rows[0]?.name || 'Cliente'
    });
  } catch (err) {
    console.error('Erro ao criar projeto:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id ORDER BY p.created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar projetos:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id WHERE p.id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Projecto nao encontrado.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar projeto:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const sendProposal = async (req, res) => {
  const { cover_letter, price } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO proposals (project_id, freelancer_id, cover_letter, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.params.id, req.user.id, cover_letter, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao enviar proposta:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, sendProposal };