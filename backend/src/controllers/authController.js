const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/db');
const { sendWelcomeEmail } = require('../services/emailService');
const { applyReferral } = require('./affiliateController');
require('dotenv').config();

// FIX: JWT_SECRET obrigatório — sem fallback inseguro
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('ERRO CRÍTICO: JWT_SECRET não está definido nas variáveis de ambiente!');
}

// FIX: ADMIN_EMAIL via variável de ambiente — sem dados pessoais no código
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
if (!ADMIN_EMAIL) {
  throw new Error('ERRO CRÍTICO: ADMIN_EMAIL não está definido nas variáveis de ambiente!');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

// FIX: Códigos de verificação guardados na BD em vez de Map em memória
// Usa a tabela email_verification_codes (ver comentário no final)

const register = async (req, res) => {
  const { name, email, password, role, referral_code } = req.body;

  // FIX: Validação de input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres.' });
  }
  const allowedRoles = ['freelancer', 'client'];
  const safeRole = allowedRoles.includes(role) ? role : 'freelancer';

  try {
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email já registado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12); // FIX: 12 rounds em vez de 10
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, safeRole]
    );
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    sendWelcomeEmail(newUser.rows[0]);
    if (referral_code) {
      applyReferral(newUser.rows[0].id, referral_code).catch(() => {});
    }
    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
    console.error('Erro no registo:', err);
    res.status(500).json({ message: 'Erro no servidor.' }); // FIX: Não expor err.message
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    // FIX: Mesmo tempo de resposta para email existente e não existente (evita enumeração de users)
    if (user.rows.length === 0) {
      await bcrypt.hash(password, 12); // dummy hash para timing constante
      return res.status(400).json({ message: 'Email ou senha incorrectos.' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou senha incorrectos.' });
    }
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role }, token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // FIX: ADMIN_EMAIL vem de variável de ambiente
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Administrador não encontrado.' });
    }
    if (!user.rows[0].is_admin) {
      return res.status(403).json({ message: 'Acesso negado. Sem privilégios de admin.' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Senha incorrecta.' });
    }
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role, is_admin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role, is_admin: true }, token });
  } catch (err) {
    console.error('Erro no admin login:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: setAdminPassword protegido — só pode ser chamado internamente (não exposto em rota pública)
const setAdminPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // FIX: Verifica se quem chama é admin autenticado
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'A nova senha deve ter pelo menos 8 caracteres.' });
  }

  try {
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = $1, is_admin = true WHERE email = $2', [hashedPassword, email]);
    res.json({ message: 'Senha de admin definida com sucesso!' });
  } catch (err) {
    console.error('Erro ao definir senha de admin:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const googleLogin = async (req, res) => {
  const { email, name, google_id, avatar } = req.body;

  if (!email || !google_id) {
    return res.status(400).json({ message: 'Dados do Google inválidos.' });
  }

  try {
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const isNewUser = user.rows.length === 0;
    if (isNewUser) {
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password, role, avatar, google_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, avatar',
        [name, email.toLowerCase(), crypto.randomBytes(32).toString('hex'), 'freelancer', avatar || '', google_id]
      );
      user = newUser;
      sendWelcomeEmail(newUser.rows[0]);
    } else {
      await pool.query(
        'UPDATE users SET google_id = $1, avatar = COALESCE(NULLIF(avatar, $2), $3) WHERE email = $4',
        [google_id, '', avatar || '', email.toLowerCase()]
      );
      user = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    }
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role, avatar: user.rows[0].avatar }, token });
  } catch (err) {
    console.error('Erro no Google login:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    // FIX: Sempre retorna a mesma mensagem (evita enumeração de emails)
    if (user.rows.length === 0) {
      return res.json({ message: 'Se este email estiver registado, enviaremos instruções.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)',
      [email.toLowerCase(), token, expiresAt]
    );
    const resetUrl = `${process.env.FRONTEND_URL || 'https://freelamz-frontend.vercel.app'}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"Freelamz" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de senha - Freelamz',
      html: `<p>Clica aqui para redefinir a tua senha: <a href="${resetUrl}">${resetUrl}</a></p><p>O link expira em 1 hora.</p>`
    });
    res.json({ message: 'Se este email estiver registado, enviaremos instruções.' });
  } catch (err) {
    console.error('Erro no forgot password:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'A nova senha deve ter pelo menos 8 caracteres.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM password_resets WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }
    const email = result.rows[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
    await pool.query('DELETE FROM password_resets WHERE token = $1', [token]);
    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error('Erro no reset password:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: Códigos guardados na BD em vez de Map em memória
const sendEmailCode = async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email inválido' });
  }
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // FIX: Guardar na BD — persiste entre restarts e múltiplas instâncias
    await pool.query(
      `INSERT INTO email_verification_codes (email, code, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET code = $2, expires_at = $3`,
      [email.toLowerCase(), code, expiresAt]
    );

    await transporter.sendMail({
      from: `"Freelamz" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Código de verificação - Freelamz',
      html: `<div style="font-family:sans-serif;text-align:center;padding:32px;"><h1>Freelamz</h1><h2>Código de verificação</h2><div style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#6366f1;">${code}</div><p>Válido por 10 minutos.</p></div>`
    });
    res.json({ message: 'Código enviado', success: true });
  } catch (err) {
    console.error('Erro ao enviar código:', err);
    res.status(500).json({ message: 'Erro ao enviar email' });
  }
};

const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    // FIX: Busca da BD em vez do Map
    const result = await pool.query(
      'SELECT * FROM email_verification_codes WHERE email = $1 AND expires_at > NOW()',
      [email.toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Código não encontrado ou expirado. Solicita novo.' });
    }
    if (result.rows[0].code !== code) {
      return res.status(400).json({ message: 'Código incorreto.' });
    }
    // FIX: Remove código após verificação bem-sucedida
    await pool.query('DELETE FROM email_verification_codes WHERE email = $1', [email.toLowerCase()]);
    res.json({ message: 'Email verificado com sucesso', success: true });
  } catch (err) {
    console.error('Erro na verificação:', err);
    res.status(500).json({ message: 'Erro ao verificar' });
  }
};

module.exports = { register, login, adminLogin, setAdminPassword, googleLogin, forgotPassword, resetPassword, sendEmailCode, verifyEmailCode };
