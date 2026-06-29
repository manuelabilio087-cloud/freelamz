const pool = require('../config/db');
const { sendPaymentEmail } = require('../services/emailService');
const { calculateCommission } = require('./subscriptionController');

const initiatePayment = async (req, res) => {
  const { contract_id, amount, mpesa_number, description } = req.body;
  const payer_id = req.user.id;

  // FIX: Validar M-Pesa ANTES de inserir o registo
  const mpesaRegex = /^(84|85|86|87)\d{7}$/;
  if (!mpesaRegex.test(mpesa_number)) {
    return res.status(400).json({ message: 'Número M-Pesa inválido. Deve começar com 84, 85, 86 ou 87.' });
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Valor inválido.' });
  }

  try {
    // FIX: Query única com JOIN para buscar contrato + freelancer + projecto
    const contractData = await pool.query(
      `SELECT c.*, u.name as freelancer_name, u.email as freelancer_email, proj.title as project_title
       FROM contracts c
       JOIN users u ON c.freelancer_id = u.id
       JOIN projects proj ON c.project_id = proj.id
       WHERE c.id = $1 AND c.client_id = $2 AND c.status = 'active'`,
      [contract_id, payer_id]
    );

    if (contractData.rows.length === 0) {
      return res.status(404).json({ message: 'Contrato não encontrado ou não está activo.' });
    }

    const contract = contractData.rows[0];
    const freelancer_id = contract.freelancer_id;
    const { commission, freelancerReceives } = calculateCommission(Number(amount));

    // Regista pagamento como pending
    const payment = await pool.query(
      `INSERT INTO payments (contract_id, payer_id, receiver_id, amount, mpesa_number, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
      [contract_id, payer_id, freelancer_id, amount, mpesa_number, description]
    );

    // FIX: Nota — em produção, substituir por chamada real à API M-Pesa com webhook
    // O setTimeout simula o processamento mas num ambiente real deve ser assíncrono
    const transaction_id = 'MPESA' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

    await pool.query(
      `UPDATE payments SET status = 'completed', mpesa_transaction_id = $1, updated_at = NOW() WHERE id = $2`,
      [transaction_id, payment.rows[0].id]
    );

    // Email e notificação em paralelo (não bloqueia a resposta)
    setImmediate(async () => {
      try {
        sendPaymentEmail(
          { name: contract.freelancer_name, email: contract.freelancer_email },
          freelancerReceives,
          contract.project_title
        );
        const io = req.app.get('io');
        if (io) {
          io.emit(`notification:${freelancer_id}`, {
            type: 'payment',
            title: 'Pagamento recebido! 💰',
            body: `Recebeste ${Number(freelancerReceives).toLocaleString()} MT via M-Pesa (após comissão de 5%).`,
            url: '/payments',
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
    console.error('Erro no pagamento:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
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
        proj.title as project_title,
        upayer.name as payer_name,
        ureceiver.name as receiver_name
       FROM payments p
       LEFT JOIN contracts c ON p.contract_id = c.id
       LEFT JOIN projects proj ON c.project_id = proj.id
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

module.exports = { initiatePayment, getMyPayments, getFinancialSummary };
