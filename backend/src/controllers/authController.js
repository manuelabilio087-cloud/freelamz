const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const pool = require('../config/db');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.json({ 
        message: 'Se este email estiver registado, enviaremos as instrucoes de recuperacao.'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      'INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)',
      [email, token, expiresAt]
    );

    const resetUrl = `https://freelamz-frontend.vercel.app/reset-password?token=${token}`;

    try {
      await resend.emails.send({
        from: 'Freelamz <onboarding@resend.dev>',
        to: email,
        subject: 'Recuperacao de senha - Freelamz',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1dbf73;">Recuperacao de senha</h2>
            <p>Ola,</p>
            <p>Recebemos um pedido para redefinir a senha da sua conta Freelamz.</p>
            <p>Clique no botao abaixo para redefinir a sua senha:</p>
            <a href="${resetUrl}" style="display: inline-block; background: #1dbf73; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Redefinir senha</a>
            <p style="margin-top: 24px; font-size: 13px; color: #74767e;">Este link expira em 1 hora. Se nao solicitou esta recuperacao, ignore este email.</p>
            <p style="font-size: 12px; color: #74767e;">Se o botao nao funcionar, copie este link: ${resetUrl}</p>
            <hr style="border: none; border-top: 1px solid #e4e5e7; margin: 24px 0;">
            <p style="font-size: 12px; color: #74767e;">Freelamz - A plataforma freelance de Mocambique</p>
          </div>
        `
      });
      console.log(`Email enviado para ${email}`);
    } catch (emailErr) {
      console.error('Erro ao enviar email:', emailErr);
    }

    res.json({ 
      message: 'Se este email estiver registado, enviaremos as instrucoes de recuperacao.'
    });
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

module.exports = { register, login, forgotPassword, resetPassword };
