const pool = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, role, bio, skills, phone, location, avatar, verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Erro no perfil:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const updateProfile = async (req, res) => {
  const { name, bio, skills, phone, location } = req.body;
  try {
    const user = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), bio = COALESCE($2, bio), skills = COALESCE($3, skills), phone = COALESCE($4, phone), location = COALESCE($5, location) WHERE id = $6 RETURNING id, name, email, role, bio, skills, phone, location, avatar, verified',
      [name, bio, skills ? JSON.stringify(skills) : null, phone, location, req.user.id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Erro ao actualizar perfil:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: Paginação adicionada — evita carregar todos os utilizadores de uma vez
const getFreelancers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const { search, location, skill } = req.query;
    const params = [limit, offset];
    let paramCount = 2;
    let filters = [];

    if (search) {
      paramCount++;
      filters.push(`(u.name ILIKE $${paramCount} OR u.bio ILIKE $${paramCount})`);
      params.push(`%${search}%`);
    }
    if (location) {
      paramCount++;
      filters.push(`u.location ILIKE $${paramCount}`);
      params.push(`%${location}%`);
    }

    const whereClause = filters.length > 0 ? 'AND ' + filters.join(' AND ') : '';

    const freelancers = await pool.query(
      `SELECT id, name, bio, skills, location, avatar, verified, created_at
       FROM users u
       WHERE (role = 'freelancer' OR EXISTS (SELECT 1 FROM gigs g WHERE g.freelancer_id = u.id)) ${whereClause}
       ORDER BY verified DESC, created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users u WHERE (role = 'freelancer' OR EXISTS (SELECT 1 FROM gigs g WHERE g.freelancer_id = u.id)) ${whereClause}`,
      params.slice(2)
    );

    res.json({
      freelancers: freelancers.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error('Erro ao buscar freelancers:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getFreelancerById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, name, bio, skills, location, avatar, verified, created_at
       FROM users WHERE id = $1 AND (role = 'freelancer' OR EXISTS (SELECT 1 FROM gigs g WHERE g.freelancer_id = users.id))`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Freelancer não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar freelancer:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: Paginação adicionada para admin
const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;

    const users = await pool.query(
      'SELECT id, name, email, role, bio, skills, avatar, verified, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    res.json({
      users: users.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit,
    });
  } catch (err) {
    console.error('Erro ao buscar utilizadores:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // FIX: Não permite apagar a si próprio nem outro admin
    if (String(id) === String(req.user.id)) {
      return res.status(400).json({ message: 'Não podes apagar a tua própria conta por aqui.' });
    }
    const target = await pool.query('SELECT is_admin FROM users WHERE id = $1', [id]);
    if (target.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    if (target.rows[0].is_admin) {
      return res.status(403).json({ message: 'Não é possível apagar outro administrador.' });
    }
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Utilizador removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover utilizador:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const verifyFreelancer = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const result = await pool.query(
      'UPDATE users SET verified = $1 WHERE id = $2 AND role = $3 RETURNING id, name, email, verified',
      [verified, id, 'freelancer']
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Freelancer não encontrado.' });
    }
    res.json({ message: verified ? 'Freelancer verificado com sucesso.' : 'Verificação removida.', user: result.rows[0] });
  } catch (err) {
    console.error('Erro ao verificar freelancer:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: Newsletter enviada em BCC em vez de To — não expõe emails de outros utilizadores
const sendNewsletter = async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ message: 'Assunto e mensagem são obrigatórios.' });
  }
  try {
    const users = await pool.query('SELECT email FROM users WHERE email IS NOT NULL');
    const emails = users.rows.map(u => u.email);
    if (emails.length === 0) {
      return res.status(400).json({ message: 'Nenhum utilizador com email encontrado.' });
    }
    // FIX: Enviado em lotes para não sobrecarregar o servidor de email
    const BATCH_SIZE = 50;
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      await transporter.sendMail({
        from: `"Freelamz" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // FIX: To é o remetente, BCC são os utilizadores
        bcc: batch,
        subject: subject,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f5f6fa;">
            <div style="background:#fff;border-radius:16px;padding:32px;">
              <h2 style="color:#1a1d27;font-size:20px;margin-bottom:16px;">${subject}</h2>
              <div style="color:#4b5563;font-size:15px;line-height:1.6;">${message}</div>
              <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8eaf0;text-align:center;color:#8b90a7;font-size:13px;">
                Freelamz — A plataforma de freelancers de Moçambique
              </div>
            </div>
          </div>
        `,
      });
    }
    res.json({ message: `Newsletter enviada para ${emails.length} utilizadores!` });
  } catch (err) {
    console.error('Erro ao enviar newsletter:', err);
    res.status(500).json({ message: 'Erro ao enviar newsletter.' });
  }
};

// FIX: Stats em query única para reduzir chamadas à BD
const getFreelancerStats = async (req, res) => {
  try {
    const userId = req.user.id;
    // FIX: estatisticas migradas do modelo antigo (projects/proposals) para o
    // modelo de servicos/gigs (estilo Fiverr): gigs publicados e encomendas.
    const [gigsCount, ongoing, completed, earnings, rating, unread] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM gigs WHERE freelancer_id = $1', [userId]),
      pool.query("SELECT COUNT(*) as total FROM orders WHERE freelancer_id = $1 AND status IN ('pending','in_progress','revision_requested','delivered')", [userId]),
      pool.query("SELECT COUNT(*) as total FROM orders WHERE freelancer_id = $1 AND status = 'completed'", [userId]),
      pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE freelancer_id = $1 AND status = 'completed'", [userId]),
      pool.query('SELECT COALESCE(AVG(rating), 0) as avg FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.freelancer_id = $1', [userId]),
      pool.query('SELECT COUNT(*) as total FROM messages WHERE receiver_id = $1 AND is_read = false', [userId]),
    ]);
    res.json({
      gigs: parseInt(gigsCount.rows[0].total),
      ongoing: parseInt(ongoing.rows[0].total),
      completed: parseInt(completed.rows[0].total),
      earnings: parseInt(earnings.rows[0].total),
      rating: parseFloat(rating.rows[0].avg).toFixed(1),
      unreadMessages: parseInt(unread.rows[0].total),
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { getProfile, updateProfile, getFreelancers, getFreelancerById, getAllUsers, deleteUser, verifyFreelancer, sendNewsletter, getFreelancerStats };
