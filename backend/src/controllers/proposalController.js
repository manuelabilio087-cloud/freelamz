const pool = require('../config/db');
const { sendProposalEmail, sendProposalAcceptedEmail } = require('../services/emailService');

const createProposal = async (req, res) => {
  const { project_id, cover_letter, price } = req.body;

  if (!project_id || !cover_letter || !price) {
    return res.status(400).json({ message: 'Projecto, carta de apresentação e preço são obrigatórios.' });
  }
  if (isNaN(price) || Number(price) <= 0) {
    return res.status(400).json({ message: 'Preço inválido.' });
  }

  try {
    // FIX: Verifica se o freelancer não é o dono do projecto
    const project = await pool.query(
      `SELECT p.*, u.email as client_email, u.name as client_name
       FROM projects p JOIN users u ON p.client_id = u.id
       WHERE p.id = $1`,
      [project_id]
    );
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Projecto não encontrado.' });
    }
    if (String(project.rows[0].client_id) === String(req.user.id)) {
      return res.status(400).json({ message: 'Não podes enviar proposta para o teu próprio projecto.' });
    }

    const existing = await pool.query(
      'SELECT id FROM proposals WHERE project_id = $1 AND freelancer_id = $2',
      [project_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Já enviaste uma proposta para este projecto.' });
    }

    // FIX: Verifica limite de propostas do plano
    const user = await pool.query('SELECT plan FROM users WHERE id = $1', [req.user.id]);
    if (user.rows[0].plan === 'free') {
      const proposalCount = await pool.query(
        `SELECT COUNT(*) as count FROM proposals WHERE freelancer_id = $1 AND created_at >= date_trunc('month', NOW())`,
        [req.user.id]
      );
      if (parseInt(proposalCount.rows[0].count) >= 3) {
        return res.status(403).json({ message: 'Atingiste o limite de 3 propostas mensais do plano gratuito. Actualiza para Pro.' });
      }
    }

    const result = await pool.query(
      `INSERT INTO proposals (project_id, freelancer_id, cover_letter, price) VALUES ($1, $2, $3, $4) RETURNING *`,
      [project_id, req.user.id, cover_letter, price]
    );

    const freelancer = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);

    setImmediate(() => {
      try {
        sendProposalEmail(
          { email: project.rows[0].client_email, name: project.rows[0].client_name },
          { name: freelancer.rows[0].name },
          { title: project.rows[0].title }
        );
        const io = req.app.get('io');
        if (io) {
          io.emit(`notification:${project.rows[0].client_id}`, {
            type: 'proposal',
            title: 'Nova proposta recebida!',
            body: `${freelancer.rows[0].name} enviou uma proposta para "${project.rows[0].title}".`,
            url: '/client-dashboard',
          });
        }
      } catch (e) {
        console.error('Erro ao enviar notificação de proposta:', e);
      }
    });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar proposta:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getProposalsByProject = async (req, res) => {
  try {
    // FIX: Verifica que quem pede é o dono do projecto
    const project = await pool.query('SELECT client_id FROM projects WHERE id = $1', [req.params.projectId]);
    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Projecto não encontrado.' });
    }
    if (String(project.rows[0].client_id) !== String(req.user.id) && !req.user.is_admin) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

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
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getMyProposals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, proj.title as project_title, proj.budget as project_budget, u.name as client_name
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
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const updateProposalStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['accepted', 'rejected', 'pending'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Estado inválido.' });
  }

  try {
    // FIX: Verifica que o cliente é dono do projecto antes de aceitar/rejeitar
    const proposalCheck = await pool.query(
      `SELECT p.*, proj.client_id, proj.title as project_title
       FROM proposals p JOIN projects proj ON p.project_id = proj.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (proposalCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Proposta não encontrada.' });
    }
    if (String(proposalCheck.rows[0].client_id) !== String(req.user.id) && !req.user.is_admin) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const result = await pool.query(
      `UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (status === 'accepted') {
      const proposal = result.rows[0];
      setImmediate(async () => {
        try {
          const [freelancerRes, projectRes] = await Promise.all([
            pool.query('SELECT email, name FROM users WHERE id = $1', [proposal.freelancer_id]),
            pool.query('SELECT title FROM projects WHERE id = $1', [proposal.project_id]),
          ]);
          if (freelancerRes.rows.length > 0 && projectRes.rows.length > 0) {
            sendProposalAcceptedEmail(
              { email: freelancerRes.rows[0].email, name: freelancerRes.rows[0].name },
              { title: projectRes.rows[0].title }
            );
            const io = req.app.get('io');
            if (io) {
              io.emit(`notification:${proposal.freelancer_id}`, {
                type: 'proposal',
                title: 'Proposta aceite! 🎉',
                body: `A tua proposta para "${projectRes.rows[0].title}" foi aceite.`,
                url: '/dashboard',
              });
            }
          }
        } catch (e) {
          console.error('Erro ao notificar aceitação de proposta:', e);
        }
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao actualizar proposta:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { createProposal, getProposalsByProject, getMyProposals, updateProposalStatus };
