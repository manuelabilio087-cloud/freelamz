const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/db');
const { sendWelcomeEmail } = require('../services/emailService');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

const emailCodes = new Map();

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email ja registado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role || 'freelancer']
    );
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET || 'freelamz_secret_key_2024',
      { expiresIn: '7d' }
    );
    // Email de boas-vindas
    sendWelcomeEmail(newUser.rows[0]);
    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
    console.error('Erro no registo:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Email ou senha incorrectos.' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou senha incorrectos.' });
    }
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET || 'freelamz_secret_key_2024',
      { expiresIn: '7d' }
    );
    res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role }, token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = 'manuelabilio087@gmail.com';
  try {
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administrador.' });
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Administrador nao encontrado.' });
    }
    if (!user.rows[0].is_admin) {
      return res.status(403).json({ message: 'Acesso negado. Conta sem privilegios de admin.' });
    }
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Senha incorrecta.' });
    }
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role, is_admin: true },
      process.env.JWT_SECRET || 'freelamz_secret_key_2024',
      { expiresIn: '7d' }
    );
    res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role, is_admin: true }, token });
  } catch (err) {
    console.error('Erro no admin login:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const setAdminPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const ADMIN_EMAIL = 'manuelabilio087@gmail.com';
  try {
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador nao encontrado.' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1, is_admin = true WHERE email = $2', [hashedPassword, email]);
    res.json({ message: 'Senha de admin definida com sucesso!' });
  } catch (err) {
    console.error('Erro ao definir senha de admin:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const googleLogin = async (req, res) => {
  const { email, name, google_id, avatar } = req.body;
  try {
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const isNewUser = user.rows.length === 0;
    if (isNewUser) {
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password, role, avatar, google_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, avatar',
        [name, email, crypto.randomBytes(16).toString('hex'), 'freelancer', avatar || '', google_id]
      );
      user = newUser;
      // Email de boas-vindas para novos utilizadores Google
      sendWelcomeEmail(newUser.rows[0]);
    } else {
      await pool.query(
        'UPDATE users SET google_id = $1, avatar = COALESCE(NULLIF(avatar, \'\'), $2) WHERE email = $3',
        [google_id, avatar || '', email]
      );
      user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    }
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET || 'freelamz_secret_key_2024',
      { expiresIn: '7d' }
    );
    res.json({ user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role, avatar: user.rows[0].avatar }, token });
  } catch (err) {
    console.error('Erro no Google login:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.json({ message: 'Se este email estiver registado, enviaremos as instrucoes de recuperacao.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)',
      [email, token, expiresAt]
    );
    const resetUrl = `https://freelamz-frontend.vercel.app/reset-password?token=${token}`;
    await transporter.sendMail({
      from: `"Freelamz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Recuperacao de senha - Freelamz',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f5f6fa;">
          <div style="background:#fff;border-radius:16px;padding:32px;">
            <h1 style="font-size:24px;font-weight:800;color:#1a1d27;">Freelamz<span style="color:#6366f1;">.</span></h1>
            <h2 style="font-size:18px;font-weight:700;margin:16px 0 8px;">Recuperação de senha</h2>
            <p style="color:#6b7280;font-size:15px;line-height:1.7;margin-bottom:20px;">Clica no botão abaixo para redefinir a tua senha. O link expira em 1 hora.</p>
            <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;">Redefinir senha</a>
          </div>
        </div>
      `
    });
    res.json({ message: 'Se este email estiver registado, enviaremos as instrucoes de recuperacao.' });
  } catch (err) {
    console.error('Erro no forgot password:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM password_resets WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Token invalido ou expirado.' });
    }
    const email = result.rows[0].email;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
    await pool.query('DELETE FROM password_resets WHERE token = $1', [token]);
    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (err) {
    console.error('Erro no reset password:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const sendEmailCode = async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email invalido' });
  }
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    emailCodes.set(email, { code, expires: Date.now() + 10 * 60 * 1000 });
    await transporter.sendMail({
      from: `"Freelamz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Codigo de verificacao - Freelamz',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f5f6fa;">
          <div style="background:#fff;border-radius:16px;padding:32px;text-align:center;">
            <h1 style="font-size:24px;font-weight:800;color:#1a1d27;">Freelamz<span style="color:#6366f1;">.</span></h1>
            <h2 style="font-size:18px;font-weight:700;margin:16px 0 8px;">Código de verificação</h2>
            <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#6366f1;margin:24px 0;">${code}</div>
            <p style="color:#6b7280;font-size:13px;">Válido por 10 minutos. Não partilhes este código.</p>
          </div>
        </div>
      `
    });
    res.json({ message: 'Codigo enviado', success: true });
  } catch (err) {
    console.error('Erro ao enviar codigo:', err);
    res.status(500).json({ message: 'Erro ao enviar email', error: err.message });
  }
};

const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const stored = emailCodes.get(email);
    if (!stored) return res.status(400).json({ message: 'Codigo nao encontrado. Solicita novo.' });
    if (Date.now() > stored.expires) {
      emailCodes.delete(email);
      return res.status(400).json({ message: 'Codigo expirado. Solicita novo.' });
    }
    if (stored.code !== code) return res.status(400).json({ message: 'Codigo incorreto' });
    emailCodes.delete(email);
    res.json({ message: 'Email verificado com sucesso', success: true });
  } catch (err) {
    console.error('Erro na verificacao:', err);
    res.status(500).json({ message: 'Erro ao verificar' });
  }
};

module.exports = { register, login, adminLogin, setAdminPassword, googleLogin, forgotPassword, resetPassword, sendEmailCode, verifyEmailCode };