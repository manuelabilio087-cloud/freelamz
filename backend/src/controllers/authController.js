const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/db');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
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

const googleLogin = async (req, res) => {
  const { email, name, google_id, avatar } = req.body;
  try {
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      const newUser = await pool.query(
        'INSERT INTO users (name, email, password, role, avatar, google_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, avatar',
        [name, email, crypto.randomBytes(16).toString('hex'), 'freelancer', avatar || '', google_id]
      );
      user = newUser;
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
    res.json({
      user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role, avatar: user.rows[0].avatar },
      token
    });
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
    try {
      await transporter.sendMail({
        from: `"Freelamz" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Recuperacao de senha - Freelamz',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1dbf73;">Recuperacao de senha</h2>
            <p>Ola,</p>
            <p>Recebemos um pedido para redefinir a senha da sua conta Freelamz.</p>
            <a href="${resetUrl}" style="display: inline-block; background: #1dbf73; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Redefinir senha</a>
            <p style="font-size: 12px; color: #74767e;">Freelamz - A plataforma freelance de Mocambique</p>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('Erro ao enviar email:', emailErr);
    }
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
      from: `"Freelamz" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Codigo de verificacao - Freelamz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1dbf73;">Verifica a tua conta</h2>
          <p>O teu codigo de verificacao e:</p>
          <h1 style="font-size: 36px; letter-spacing: 8px; color: #404145; margin: 24px 0;">${code}</h1>
          <p style="color: #74767e; font-size: 13px;">Valido por 10 minutos. Nao partilhes este codigo.</p>
          <p style="font-size: 12px; color: #74767e;">Freelamz - A plataforma freelance de Mocambique</p>
        </div>
      `
    });
    console.log(`Codigo para ${email}: ${code}`);
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

module.exports = { register, login, googleLogin, forgotPassword, resetPassword, sendEmailCode, verifyEmailCode };