const pool = require('../config/db');
const { sendPaymentEmail } = require('../services/emailService');
const { calculateCommission } = require('./subscriptionController');

const initiatePayment = async (req, res) => {
  const { contract_id, amount, mpesa_number, description } = req.body;
  const payer_id = req.user.id;

  try {
    const contract = await pool.query(
      'SELECT * FROM contracts WHERE id = $1 AND client_id = $2 AND status = $3',
      [contract_id, payer_id, 'active']
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({ message: 'Contrato no encontrado ou no est activo.' });
    }

    const freelancer_id = contract.rows[0].freelancer_id;

    // Calcula comisso 5%
    const { commission, freelancerReceives } = calculateCommission(amount);

    const payment = await pool.query(
      `INSERT INTO payments (contract_id, payer_id, receiver_id, amount, mpesa_number, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
      [contract_id, payer_id, freelancer_id, amount, mpesa_number, description]
    );

    // Simula M-Pesa
    const mpesaRegex = /^(84|85|86|87)\d{7}$/;
    if (!mpesaRegex.test(mpesa_number)) {
      return res.status(400).json({ message: 'Nmero M-Pesa invlido.' });
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    const transaction_id = 'MPESA' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

    await pool.query(
      `UPDATE payments SET status = 'completed', mpesa_transaction_id = $1, updated_at = NOW()
       WHERE id = $2`,
      [transaction_id, payment.rows[0].id]
    );

    // Busca dados do freelancer para email
    const freelancer = await pool.query(
      'SELECT name, email FROM users WHERE id = $1',
      [freelancer_id]
    );

    // Busca ttulo do projecto
    const project = await pool.query(
      'SELECT proj.title FROM contracts c JOIN projects proj ON c.project_id = proj.id WHERE c.id = $1',
      [contract_id]
    );

    const projectTitle = project.rows[0]?.title || 'Projecto';

    // Email ao freelancer com valor j deduzido
    if (freelancer.rows.length > 0) {
      sendPaymentEmail(freelancer.rows[0], freelancerReceives, projectTitle);
    }

    // Notificao Socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit(`notification:${freelancer_id}`, {
        type: 'payment',
        title: 'Pagamento recebido! ',
        body: `Recebeste ${Number(freelancerReceives).toLocaleString()} MT via M-Pesa (aps comisso de 5%).`,
        url: '/payments',
      });
    }

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
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
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
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar pagamentos:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const received = await pool.query(
      `SELECT COALESCE(SUM(amount * 0.95), 0) as total FROM payments
       WHERE receiver_id = $1 AND status = 'completed'
       AND description NOT LIKE '%Subscrio%'`,
      [userId]
    );

    const sent = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM payments
       WHERE payer_id = $1 AND status = 'completed'`,
      [userId]
    );

    const pending = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM payments
       WHERE (payer_id = $1 OR receiver_id = $1) AND status = 'pending'`,
      [userId]
    );

    res.json({
      received: parseFloat(received.rows[0].total),
      sent: parseFloat(sent.rows[0].total),
      pending: parseFloat(pending.rows[0].total),
    });
  } catch (err) {
    console.error('Erro no resumo financeiro:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { initiatePayment, getMyPayments, getFinancialSummary };
