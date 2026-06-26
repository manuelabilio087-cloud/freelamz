const pool = require('../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, role, bio, skills, phone, location, avatar, verified, created_at FROM users WHERE id = $1',
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
      'UPDATE users SET name = COALESCE($1, name), bio = COALESCE($2, bio), skills = COALESCE($3, skills), phone = COALESCE($4, phone), location = COALESCE($5, location) WHERE id = $6 RETURNING id, name, email, role, bio, skills, phone, location, avatar, verified',
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
      "SELECT id, name, email, bio, skills, location, avatar, verified, created_at FROM users WHERE role = 'freelancer' ORDER BY created_at DESC"
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
      'SELECT id, name, email, role, bio, skills, avatar, verified, created_at FROM users ORDER BY created_at DESC'
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

const verifyFreelancer = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;
    const result = await pool.query(
      'UPDATE users SET verified = $1 WHERE id = $2 AND role = $3 RETURNING id, name, email, verified',
      [verified, id, 'freelancer']
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Freelancer nao encontrado.' });
    }
    res.json({ message: verified ? 'Freelancer verificado com sucesso.' : 'Verificacao removida.', user: result.rows[0] });
  } catch (err) {
    console.error('Erro ao verificar freelancer:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const sendNewsletter = async (req, res) => {
  const { subject, message } = req.body;
  try {
    const users = await pool.query('SELECT email FROM users WHERE email IS NOT NULL');
    const emails = users.rows.map(u => u.email);
    
    if (emails.length === 0) {
      return res.status(400).json({ message: 'Nenhum utilizador com email encontrado.' });
    }

    const mailOptions = {
      from: `"Freelamz" <${process.env.EMAIL_USER}>`,
      to: emails.join(','),
      subject: subject,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f5f6fa;">
          <div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="width:48px;height:48px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-size:24px;font-weight:700;">F</span>
              </div>
            </div>
            <h2 style="color:#1a1d27;font-size:20px;margin-bottom:16px;">${subject}</h2>
            <div style="color:#4b5563;font-size:15px;line-height:1.6;">${message}</div>
            <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e8eaf0;text-align:center;color:#8b90a7;font-size:13px;">
              Freelamz · A plataforma de freelancers de Moçambique
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: `Newsletter enviada para ${emails.length} utilizadores!` });
  } catch (err) {
    console.error('Erro ao enviar newsletter:', err);
    res.status(500).json({ message: 'Erro ao enviar newsletter.', error: err.message });
  }
};

module.exports = { getProfile, updateProfile, getFreelancers, getAllUsers, deleteUser, verifyFreelancer, sendNewsletter };