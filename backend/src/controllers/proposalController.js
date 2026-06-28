const pool = require('../config/db');
const { sendProposalEmail, sendProposalAcceptedEmail } = require('../services/emailService');

const createProposal = async (req, res) => {
  const { project_id, cover_letter, price } = req.body;
  try {
    // Verifica se j enviou proposta
    const existing = await pool.query(
      'SELECT * FROM proposals WHERE project_id = $1 AND freelancer_id = $2',
      [project_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'J enviaste uma proposta para este projecto.' });
    }

    const result = await pool.query(
      `INSERT INTO proposals (project_id, freelancer_id, cover_letter, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [project_id, req.user.id, cover_letter, price]
    );

    // Busca dados para o email
    const project = await pool.query(
      `SELECT p.*, u.email as client_email, u.name as client_name 
       FROM projects p JOIN users u ON p.client_id = u.id 
       WHERE p.id = $1`,
      [project_id]
    );
    const freelancer = await pool.query(
      'SELECT name FROM users WHERE id = $1',
      [req.user.id]
    );

    if (project.rows.length > 0) {
      // Email para o cliente
      sendProposalEmail(
        { email: project.rows[0].client_email, name: project.rows[0].client_name },
        { name: freelancer.rows[0].name },
        { title: project.rows[0].title }
      );

      // Notificao Socket.io
      const io = req.app.get('io');
      if (io) {
        io.emit(`notification:${project.rows[0].client_id}`, {
          type: 'proposal',
          title: 'Nova proposta recebida!',
          body: `${freelancer.rows[0].name} enviou uma proposta para "${project.rows[0].title}".`,
          url: '/client-dashboard',
        });
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar proposta:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getProposalsByProject = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as freelancer_name, u.avatar as freelancer_avatar, u.bio as freelancer_bio
       FROM proposals p
       JOIN users u ON p.freelancer_id = u.id
       WHERE p.project_id = $1
       ORDER BY p.created_at DESC`,
      [req.params.projectId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar propostas:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getMyProposals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, proj.title as project_title, proj.budget as project_budget,
        u.name as client_name
       FROM proposals p
       JOIN projects proj ON p.project_id = proj.id
       JOIN users u ON proj.client_id = u.id
       WHERE p.freelancer_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar minhas propostas:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const updateProposalStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proposta no encontrada.' });
    }

    // Se aceite, envia email ao freelancer
    if (status === 'accepted') {
      const proposal = result.rows[0];
      const freelancer = await pool.query(
        'SELECT email, name FROM users WHERE id = $1',
        [proposal.freelancer_id]
      );
      const project = await pool.query(
        'SELECT title FROM projects WHERE id = $1',
        [proposal.project_id]
      );

      if (freelancer.rows.length > 0 && project.rows.length > 0) {
        sendProposalAcceptedEmail(
          { email: freelancer.rows[0].email, name: freelancer.rows[0].name },
          { title: project.rows[0].title }
        );

        // Notificao Socket.io
        const io = req.app.get('io');
        if (io) {
          io.emit(`notification:${proposal.freelancer_id}`, {
            type: 'proposal',
            title: 'Proposta aceite! ',
            body: `A tua proposta para "${project.rows[0].title}" foi aceite.`,
            url: '/dashboard',
          });
        }
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao actualizar proposta:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { createProposal, getProposalsByProject, getMyProposals, updateProposalStatus };
