const pool = require('../config/db');

// Inicia pagamento M-Pesa
const initiatePayment = async (req, res) => {
  const { contract_id, amount, mpesa_number, description } = req.body;
  const payer_id = req.user.id;

  try {
    // Verifica se o contrato existe e está activo
    const contract = await pool.query(
      'SELECT * FROM contracts WHERE id = $1 AND client_id = $2 AND status = $3',
      [contract_id, payer_id, 'active']
    );

    if (contract.rows.length === 0) {
      return res.status(404).json({ message: 'Contrato nao encontrado ou nao esta activo.' });
    }

    const freelancer_id = contract.rows[0].freelancer_id;

    // Cria registo de pagamento
    const payment = await pool.query(
      `INSERT INTO payments (contract_id, payer_id, receiver_id, amount, mpesa_number, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
      [contract_id, payer_id, freelancer_id, amount, mpesa_number, description]
    );

    // Aqui integrarias com a API real da Vodacom M-Pesa Moçambique
    // Por agora simulamos a resposta da API
    const mpesaResponse = await simulateMpesaPayment(mpesa_number, amount);

    if (mpesaResponse.success) {
      // Actualiza pagamento com ID da transacção
      await pool.query(
        `UPDATE payments SET status = 'completed', mpesa_transaction_id = $1, updated_at = NOW() 
         WHERE id = $2`,
        [mpesaResponse.transaction_id, payment.rows[0].id]
      );

      // Notifica freelancer via Socket.io
      const io = req.app.get('io');
      if (io) {
        io.emit(`notification:${freelancer_id}`, {
          type: 'payment',
          title: 'Pagamento recebido! 💰',
          body: `Recebeste ${amount} MZN via M-Pesa.`,
          url: '/dashboard',
        });
      }

      return res.json({
        message: 'Pagamento efectuado com sucesso!',
        transaction_id: mpesaResponse.transaction_id,
        payment: { ...payment.rows[0], status: 'completed' }
      });
    } else {
      await pool.query(
        `UPDATE payments SET status = 'failed', updated_at = NOW() WHERE id = $1`,
        [payment.rows[0].id]
      );
      return res.status(400).json({ message: 'Pagamento falhou. Tenta novamente.' });
    }
  } catch (err) {
    console.error('Erro no pagamento:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

// Simulação da API M-Pesa (substituir pela API real da Vodacom MZ)
const simulateMpesaPayment = async (mpesa_number, amount) => {
  // Valida número M-Pesa moçambicano (84/85/86/87)
  const mpesaRegex = /^(84|85|86|87)\d{7}$/;
  if (!mpesaRegex.test(mpesa_number)) {
    return { success: false, error: 'Número M-Pesa inválido.' };
  }

  // Simula delay da API (1-2 segundos)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Gera ID de transacção simulado
  const transaction_id = 'MPESA' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();

  return { success: true, transaction_id };
};

// Busca pagamentos do utilizador
const getMyPayments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        c.project_id,
        proj.title as project_title,
        upayer.name as payer_name,
        ureceiver.name as receiver_name
       FROM payments p
       JOIN contracts c ON p.contract_id = c.id
       JOIN projects proj ON c.project_id = proj.id
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

// Resumo financeiro
const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const received = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM payments 
       WHERE receiver_id = $1 AND status = 'completed'`,
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