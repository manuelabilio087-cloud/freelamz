const pool = require('../config/db');
const { sendPaymentEmail } = require('../services/emailService');
const { rewardReferralOnSubscription } = require('./affiliateController');

const PLANS = {
  free: { name: 'Gratuito', price: 0, proposals_limit: 3 },
  pro: { name: 'Pro', price: 200, proposals_limit: null },
};

const COMMISSION_RATE = 0.05; // 5%

const subscribePro = async (req, res) => {
  const { mpesa_number } = req.body;
  const userId = req.user.id;

  // FIX: Validação antes de qualquer operação
  const mpesaRegex = /^(84|85|86|87)\d{7}$/;
  if (!mpesa_number || !mpesaRegex.test(mpesa_number)) {
    return res.status(400).json({ message: 'Número M-Pesa inválido. Deve começar com 84, 85, 86 ou 87.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verifica se já tem plano Pro activo
    const existing = await client.query(
      `SELECT id FROM subscriptions WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()`,
      [userId]
    );
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Já tens um plano Pro activo.' });
    }

    // FIX: Nota — substituir por API M-Pesa real em produção
    const transaction_id = 'MPESA' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Cancela subscrições anteriores e cria nova — dentro da mesma transação
    await client.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );
    await client.query(
      `INSERT INTO subscriptions (user_id, plan, status, amount, mpesa_number, expires_at)
       VALUES ($1, 'pro', 'active', 200, $2, $3)`,
      [userId, mpesa_number, expiresAt]
    );
    await client.query(`UPDATE users SET plan = 'pro' WHERE id = $1`, [userId]);
    await client.query(
      `INSERT INTO payments (payer_id, receiver_id, amount, mpesa_number, mpesa_transaction_id, status, description)
       VALUES ($1, $1, 200, $2, $3, 'completed', 'Subscrição Pro — Freelamz')`,
      [userId, mpesa_number, transaction_id]
    );

    await client.query('COMMIT');

    // Notificações fora da transação
    setImmediate(async () => {
      try {
        rewardReferralOnSubscription(userId).catch(() => {});
        const user = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);
        if (user.rows.length > 0) {
          sendPaymentEmail(user.rows[0], 200, 'Subscrição Pro — Freelamz');
        }
        const io = req.app.get('io');
        if (io) {
          io.emit(`notification:${userId}`, {
            type: 'info',
            title: 'Plano Pro ativado! 🚀',
            body: 'Tens agora propostas ilimitadas e perfil destacado.',
            url: '/dashboard',
          });
        }
      } catch (e) {
        console.error('Erro ao enviar notificação de subscrição:', e);
      }
    });

    res.json({
      message: 'Plano Pro ativado com sucesso!',
      transaction_id,
      expires_at: expiresAt,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro na subscrição:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

const getMyPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    // FIX: Queries em paralelo
    const [userResult, subResult, proposalsResult] = await Promise.all([
      pool.query('SELECT id, name, plan FROM users WHERE id = $1', [userId]),
      pool.query(
        `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' AND expires_at > NOW() ORDER BY expires_at DESC LIMIT 1`,
        [userId]
      ),
      pool.query(
        `SELECT COUNT(*) as count FROM proposals WHERE freelancer_id = $1 AND created_at >= date_trunc('month', NOW())`,
        [userId]
      ),
    ]);

    let plan = userResult.rows[0].plan || 'free';

    // Se plano Pro expirou, volta para free
    if (plan === 'pro' && subResult.rows.length === 0) {
      await pool.query(`UPDATE users SET plan = 'free' WHERE id = $1`, [userId]);
      plan = 'free';
    }

    const planInfo = PLANS[plan];
    const proposalCount = parseInt(proposalsResult.rows[0].count);

    res.json({
      plan,
      plan_name: planInfo.name,
      price: planInfo.price,
      proposals_used: proposalCount,
      proposals_limit: planInfo.proposals_limit,
      proposals_remaining: planInfo.proposals_limit ? Math.max(0, planInfo.proposals_limit - proposalCount) : null,
      can_send_proposal: planInfo.proposals_limit === null || proposalCount < planInfo.proposals_limit,
      subscription: subResult.rows[0] || null,
    });
  } catch (err) {
    console.error('Erro ao buscar plano:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const calculateCommission = (amount) => {
  const commission = amount * COMMISSION_RATE;
  const freelancerReceives = amount - commission;
  return { commission, freelancerReceives, rate: COMMISSION_RATE };
};

// FIX: Queries em paralelo para dashboard de admin
const getPlatformRevenue = async (req, res) => {
  try {
    const [subscriptionRevenue, commissionRevenue, activeSubs, monthlyRevenue] = await Promise.all([
      pool.query(`SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM subscriptions WHERE status = 'active'`),
      pool.query(`SELECT COALESCE(SUM(amount * 0.05), 0) as total, COUNT(*) as count FROM payments WHERE status = 'completed' AND description NOT LIKE '%Subscrição%'`),
      pool.query(`SELECT COUNT(*) as count FROM users WHERE plan = 'pro'`),
      pool.query(`SELECT COALESCE(SUM(amount), 0) as total FROM subscriptions WHERE status = 'active' AND created_at >= date_trunc('month', NOW())`),
    ]);

    res.json({
      subscription_revenue: parseFloat(subscriptionRevenue.rows[0].total),
      commission_revenue: parseFloat(commissionRevenue.rows[0].total),
      total_revenue: parseFloat(subscriptionRevenue.rows[0].total) + parseFloat(commissionRevenue.rows[0].total),
      active_pro_users: parseInt(activeSubs.rows[0].count),
      monthly_revenue: parseFloat(monthlyRevenue.rows[0].total),
    });
  } catch (err) {
    console.error('Erro ao buscar receita:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { subscribePro, getMyPlan, calculateCommission, getPlatformRevenue };
