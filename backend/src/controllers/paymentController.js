const pool = require('../config/db');
const { sendPaymentEmail } = require('../services/emailService');
const { calculateCommission } = require('./subscriptionController');

const initiatePayment = async (req, res) => {
  const { contract_id, order_id, amount, mpesa_number, description } = req.body;
  const payer_id = req.user.id;

  // FIX: Validar M-Pesa ANTES de inserir o registo
  const mpesaRegex = /^(84|85|86|87)\d{7}$/;
  if (!mpesaRegex.test(mpesa_number)) {
    return res.status(400).json({ message: 'Número M-Pesa inválido. Deve começar com 84, 85, 86 ou 87.' });
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Valor inválido.' });
  }
  if (!contract_id && !order_id) {
    return res.status(400).json({ message: 'É necessário indicar contract_id ou order_id.' });
  }
  if (contract_id && order_id) {
    return res.status(400).json({ message: 'Indica apenas contract_id OU order_id, não ambos.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let freelancer_id, freelancer_name, freelancer_email, title;

    if (order_id) {
      // Fluxo gig/order (Fiverr-style)
      const orderData = await client.query(
        `SELECT o.*, u.name as freelancer_name, u.email as freelancer_email, g.title as gig_title
         FROM orders o
         JOIN users u ON o.freelancer_id = u.id
         JOIN gigs g ON o.gig_id = g.id
         WHERE o.id = $1 AND o.client_id = $2
         FOR UPDATE`,
        [order_id, payer_id]
      );
      if (orderData.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Encomenda não encontrada.' });
      }
      const order = orderData.rows[0];
      if (order.payment_status === 'paid') {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Esta encomenda já foi paga.' });
      }
      freelancer_id = order.freelancer_id;
      freelancer_name = order.freelancer_name;
      freelancer_email = order.freelancer_email;
      title = order.gig_title;
    } else {
      // Fluxo project/contract (Upwork-style)
      const contractData = await client.query(
        `SELECT c.*, u.name as freelancer_name, u.email as freelancer_email, proj.title as project_title
         FROM contracts c
         JOIN users u ON c.freelancer_id = u.id
         JOIN projects proj ON c.project_id = proj.id
         WHERE c.id = $1 AND c.client_id = $2 AND c.status = 'active'`,
        [contract_id, payer_id]
      );
      if (contractData.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Contrato não encontrado ou não está activo.' });
      }
      const contract = contractData.rows[0];
      freelancer_id = contract.freelancer_id;
      freelancer_name = contract.freelancer_name;
      freelancer_email = contract.freelancer_email;
      title = contract.project_title;
    }

    const { commission, freelancerReceives } = calculateCommission(Number(amount));

    // Regista pagamento como pending
    const payment = await client.query(
      `INSERT INTO payments (contract_id, order_id, payer_id, receiver_id, amount, mpesa_number, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
      [contract_id || null, order_id || null, payer_id, freelancer_id, amount, mpesa_number, description]
    );

    // FIX: Nota — em produção, substituir por chamada real à API M-Pesa com webhook
    // O setTimeout simula o processamento mas num ambiente real deve ser assíncrono
    const transaction_id = 'MPESA' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

    await client.query(
      `UPDATE payments SET status = 'completed', mpesa_transaction_id = $1, updated_at = NOW() WHERE id = $2`,
      [transaction_id, payment.rows[0].id]
    );

    // Se for pagamento de uma order, destranca o trabalho: passa a in_progress + paid
    if (order_id) {
      await client.query(
        `UPDATE orders SET payment_status = 'paid', status = 'in_progress' WHERE id = $1`,
        [order_id]
      );
    }

    await client.query('COMMIT');

    // Email e notificação em paralelo (não bloqueia a resposta)
    setImmediate(async () => {
      try {
        sendPaymentEmail(
          { name: freelancer_name, email: freelancer_email },
          freelancerReceives,
          title
        );
        const io = req.app.get('io');
        if (io) {
          io.emit(`notification:${freelancer_id}`, {
            type: 'payment',
            title: 'Pagamento recebido! 💰',
            body: order_id
              ? `O pagamento de "${title}" foi confirmado (${Number(freelancerReceives).toLocaleString()} MT após comissão). Podes começar o trabalho.`
              : `Recebeste ${Number(freelancerReceives).toLocaleString()} MT via M-Pesa (após comissão de 5%).`,
            url: order_id ? '/orders' : '/payments',
          });
        }
      } catch (e) {
        console.error('Erro ao enviar notificação de pagamento:', e);
      }
    });

    return res.json({
      message: 'Pagamento efectuado com sucesso!',
      transaction_id,
      amount_paid: Number(amount),
      commission: Number(commission),
      freelancer_receives: Number(freelancerReceives),
      payment: { ...payment.rows[0], status: 'completed' }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro no pagamento:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

const getMyPayments = async (req, res) => {
  try {
    // FIX: Paginação adicionada
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT p.*,
        c.project_id,
        COALESCE(proj.title, g.title) as project_title,
        upayer.name as payer_name,
        ureceiver.name as receiver_name
       FROM payments p
       LEFT JOIN contracts c ON p.contract_id = c.id
       LEFT JOIN projects proj ON c.project_id = proj.id
       LEFT JOIN orders o ON p.order_id = o.id
       LEFT JOIN gigs g ON o.gig_id = g.id
       JOIN users upayer ON p.payer_id = upayer.id
       JOIN users ureceiver ON p.receiver_id = ureceiver.id
       WHERE p.payer_id = $1 OR p.receiver_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar pagamentos:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    // FIX: Promise.all para queries em paralelo
    const [received, sent, pending] = await Promise.all([
      pool.query(
        `SELECT COALESCE(SUM(amount * 0.95), 0) as total FROM payments
         WHERE receiver_id = $1 AND status = 'completed' AND description NOT LIKE '%Subscrição%'`,
        [userId]
      ),
      pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payer_id = $1 AND status = 'completed'`,
        [userId]
      ),
      pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE (payer_id = $1 OR receiver_id = $1) AND status = 'pending'`,
        [userId]
      ),
    ]);
    res.json({
      received: parseFloat(received.rows[0].total),
      sent: parseFloat(sent.rows[0].total),
      pending: parseFloat(pending.rows[0].total),
    });
  } catch (err) {
    console.error('Erro no resumo financeiro:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// ADMIN: quanto cada freelancer tem para receber, ainda nao transferido manualmente
const getPendingPayouts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        u.id as freelancer_id,
        u.name as freelancer_name,
        u.phone,
        COUNT(p.id) as num_payments,
        SUM(p.amount * 0.95) as total_owed,
        MIN(p.created_at) as oldest_payment
       FROM payments p
       JOIN users u ON p.receiver_id = u.id
       WHERE p.status = 'completed'
         AND p.payout_status = 'pending'
         AND p.description NOT LIKE '%Subscrição%'
       GROUP BY u.id, u.name, u.phone
       ORDER BY total_owed DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar payouts pendentes:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// ADMIN: marca todos os pagamentos pendentes de um freelancer como ja transferidos
const markPayoutsPaid = async (req, res) => {
  const { freelancerId } = req.params;
  try {
    const result = await pool.query(
      `UPDATE payments SET payout_status = 'paid_out', updated_at = NOW()
       WHERE receiver_id = $1 AND status = 'completed' AND payout_status = 'pending'
       RETURNING id`,
      [freelancerId]
    );
    res.json({ message: `${result.rows.length} pagamento(s) marcados como transferidos.`, count: result.rows.length });
  } catch (err) {
    console.error('Erro ao marcar payouts:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { initiatePayment, getMyPayments, getFinancialSummary, getPendingPayouts, markPayoutsPaid };
