const pool = require('../config/db');
const crypto = require('crypto');

const REFERRAL_BONUS = 50; // MT por cada novo utilizador referido que se torna Pro

const getMyReferralCode = async (req, res) => {
  try {
    const user = await pool.query('SELECT referral_code FROM users WHERE id = $1', [req.user.id]);
    let code = user.rows[0].referral_code;

    if (!code) {
      code = crypto.randomBytes(4).toString('hex').toUpperCase();
      await pool.query('UPDATE users SET referral_code = $1 WHERE id = $2', [code, req.user.id]);
    }

    const stats = await pool.query(
      `SELECT COUNT(*) as total_referred, COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0) as total_earned,
        COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as pending_earnings
       FROM referral_earnings WHERE referrer_id = $1`,
      [req.user.id]
    );

    res.json({
      referral_code: code,
      referral_link: `https://freelamz-frontend.vercel.app/register?ref=${code}`,
      total_referred: parseInt(stats.rows[0].total_referred),
      total_earned: parseFloat(stats.rows[0].total_earned),
      pending_earnings: parseFloat(stats.rows[0].pending_earnings),
    });
  } catch (err) {
    console.error('Erro ao buscar código de referência:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: Chamado no registo quando há um código de referência válido
const applyReferral = async (referredUserId, referralCode) => {
  try {
    if (!referralCode) return;
    const referrer = await pool.query('SELECT id FROM users WHERE referral_code = $1', [referralCode]);
    if (referrer.rows.length === 0) return;
    if (String(referrer.rows[0].id) === String(referredUserId)) return;

    await pool.query('UPDATE users SET referred_by = $1 WHERE id = $2', [referrer.rows[0].id, referredUserId]);
  } catch (err) {
    console.error('Erro ao aplicar referência:', err);
  }
};

// FIX: Chamado quando o utilizador referido subscreve o plano Pro — gera comissão
const rewardReferralOnSubscription = async (subscriberId) => {
  try {
    const user = await pool.query('SELECT referred_by FROM users WHERE id = $1', [subscriberId]);
    if (!user.rows[0]?.referred_by) return;

    const existing = await pool.query(
      'SELECT id FROM referral_earnings WHERE referrer_id = $1 AND referred_user_id = $2',
      [user.rows[0].referred_by, subscriberId]
    );
    if (existing.rows.length > 0) return; // Já recompensado

    await pool.query(
      'INSERT INTO referral_earnings (referrer_id, referred_user_id, amount, status) VALUES ($1, $2, $3, $4)',
      [user.rows[0].referred_by, subscriberId, REFERRAL_BONUS, 'pending']
    );
  } catch (err) {
    console.error('Erro ao recompensar referência:', err);
  }
};

module.exports = { getMyReferralCode, applyReferral, rewardReferralOnSubscription };
