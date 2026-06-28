const pool = require('../config/db');
const { sendPaymentEmail } = require('../services/emailService');

const PLANS = {
  free: { name: 'Gratuito', price: 0, proposals_limit: 3 },
  pro: { name: 'Pro', price: 200, proposals_limit: null },
};

const COMMISSION_RATE = 0.05; // 5%

// Subscrever plano Pro
const subscribePro = async (req, res) => {
  const { mpesa_number } = req.body;
  const userId = req.user.id;

  try {
    // Valida nmero M-Pesa
    const mpesaRegex = /^(84|85|86|87)\d{7}$/;
    if (!mpesaRegex.test(mpesa_number)) {
      return res.status(400).json({ message: 'Nmero M-Pesa invlido. Deve comear com 84, 85, 86 ou 87.' });
    }

    // Simula pagamento M-Pesa (substituir pela API real)
    await new Promise(resolve => setTimeout(resolve, 1500));
    const transaction_id = 'MPESA' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Define expirao para 30 dias
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Cancela subscrio anterior se existir
    await pool.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    // Cria nova subscrio
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, status, amount, mpesa_number, expires_at)
       VALUES ($1, 'pro', 'active', 200, $2, $3)`,
      [userId, mpesa_number, expiresAt]
    );

    // Atualiza plano do utilizador
    await pool.query(
      `UPDATE users SET plan = 'pro' WHERE id = $1`,
      [userId]
    );

    // Regista pagamento
    await pool.query(
      `INSERT INTO payments (payer_id, receiver_id, amount, mpesa_number, mpesa_transaction_id, status, description)
       VALUES ($1, $1, 200, $2, $3, 'completed', 'Subscrio Pro  Freelamz')`,
      [userId, mpesa_number, transaction_id]
    );

    // Email de confirmao
    const user = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);
    if (user.rows.length > 0) {
      sendPaymentEmail(user.rows[0], 200, 'Subscrio Pro  Freelamz');
    }

    // Notificao Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit(`notification:${userId}`, {
        type: 'info',
        title: 'Plano Pro ativado! ',
        body: 'Tens agora propostas ilimitadas e perfil destacado.',
        url: '/dashboard',
      });
    }

    res.json({
      message: 'Plano Pro ativado com sucesso!',
      transaction_id,
      expires_at: expiresAt,
    });
  } catch (err) {
    console.error('Erro na subscrio:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

// Busca plano atual do utilizador
const getMyPlan = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await pool.query(
      'SELECT id, name, plan FROM users WHERE id = $1',
      [userId]
    );

    // Verifica se subscrio Pro ainda est vlida
    const sub = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 AND status = 'active' AND expires_at > NOW()
       ORDER BY expires_at DESC LIMIT 1`,
      [userId]
    );

    // Se expirou, volta para free
    if (user.rows[0].plan === 'pro' && sub.rows.length === 0) {
      await pool.query(`UPDATE users SET plan = 'free' WHERE id = $1`, [userId]);
      user.rows[0].plan = 'free';
    }

    // Conta propostas do ms atual
    const proposalsThisMonth = await pool.query(
      `SELECT COUNT(*) as count FROM proposals 
       WHERE freelancer_id = $1 
       AND created_at >= date_trunc('month', NOW())`,
      [userId]
    );

    const plan = user.rows[0].plan || 'free';
    const planInfo = PLANS[plan];
    const proposalCount = parseInt(proposalsThisMonth.rows[0].count);

    res.json({
      plan,
      plan_name: planInfo.name,
      price: planInfo.price,
      proposals_used: proposalCount,
      proposals_limit: planInfo.proposals_limit,
      proposals_remaining: planInfo.proposals_limit ? Math.max(0, planInfo.proposals_limit - proposalCount) : null,
      can_send_proposal: planInfo.proposals_limit === null || proposalCount < planInfo.proposals_limit,
      subscription: sub.rows[0] || null,
    });
  } catch (err) {
    console.error('Erro ao buscar plano:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

// Calcula comisso num pagamento
const calculateCommission = (amount) => {
  const commission = amount * COMMISSION_RATE;
  const freelancerReceives = amount - commission;
  return { commission, freelancerReceives, rate: COMMISSION_RATE };
};

// Resumo financeiro da plataforma (s admin)
const getPlatformRevenue = async (req, res) => {
  try {
    // Receita de subscries
    const subscriptionRevenue = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count
       FROM subscriptions WHERE status = 'active'`
    );

    // Receita de comisses (5% dos pagamentos)
    const commissionRevenue = await pool.query(
      `SELECT COALESCE(SUM(amount * 0.05), 0) as total, COUNT(*) as count
       FROM payments WHERE status = 'completed' 
       AND description NOT LIKE '%Subscrio%'`
    );

    // Subscries ativas
    const activeSubs = await pool.query(
      `SELECT COUNT(*) as count FROM users WHERE plan = 'pro'`
    );

    // Receita do ms atual
    const monthlyRevenue = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM subscriptions 
       WHERE status = 'active' AND created_at >= date_trunc('month', NOW())`
    );

    res.json({
      subscription_revenue: parseFloat(subscriptionRevenue.rows[0].total),
      commission_revenue: parseFloat(commissionRevenue.rows[0].total),
      total_revenue: parseFloat(subscriptionRevenue.rows[0].total) + parseFloat(commissionRevenue.rows[0].total),
      active_pro_users: parseInt(activeSubs.rows[0].count),
      monthly_revenue: parseFloat(monthlyRevenue.rows[0].total),
    });
  } catch (err) {
    console.error('Erro ao buscar receita:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { subscribePro, getMyPlan, calculateCommission, getPlatformRevenue };
