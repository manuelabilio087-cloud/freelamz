const pool = require('../config/db');

const createProject = async (req, res) => {
  // FIX: modelo "projectos" (estilo Upwork) descontinuado - a plataforma agora
  // usa o modelo de servicos/gigs (estilo Fiverr): so freelancers publicam,
  // clientes encomendam directamente.
  return res.status(410).json({
    message: 'A publicacao de projectos foi descontinuada. Os freelancers publicam servicos (gigs) e os clientes encomendam directamente.',
  });
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

module.exports = { createProject, getProjects, getProjectById, sendProposal, deleteProject };

async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }
    res.json({ message: 'Projeto removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover projeto:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
}