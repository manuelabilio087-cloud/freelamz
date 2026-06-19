const pool = require('../config/db');

const createProject = async (req, res) => {
  const { title, description, budget, category } = req.body;

  try {
    const project = await pool.query(
      'INSERT INTO projects (title, description, budget, category, client_id) VALUES (\, \, \, \, \) RETURNING *',
      [title, description, budget, category, req.user.id]
    );

    res.status(201).json(project.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await pool.query(
      'SELECT p.*, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id ORDER BY p.created_at DESC'
    );

    res.json(projects.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await pool.query(
      'SELECT p.*, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id WHERE p.id = \',
      [req.params.id]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Projecto não encontrado.' });
    }

    res.json(project.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const sendProposal = async (req, res) => {
  const { cover_letter, price } = req.body;

  try {
    const proposal = await pool.query(
      'INSERT INTO proposals (project_id, freelancer_id, cover_letter, price) VALUES (\, \, \, \) RETURNING *',
      [req.params.id, req.user.id, cover_letter, price]
    );

    res.status(201).json(proposal.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, sendProposal };
