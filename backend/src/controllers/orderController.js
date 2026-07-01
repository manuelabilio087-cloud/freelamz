const pool = require('../config/db');
const { sendPaymentEmail } = require('../services/emailService');
const { recalculateSellerLevel } = require('../services/sellerLevelService');

const REVISION_LIMIT_DEFAULT = 1;

const createOrder = async (req, res) => {
  const { gig_id, package_id, extras, requirements } = req.body;
  const client_id = req.user.id;

  if (!gig_id || !package_id) {
    return res.status(400).json({ message: 'Gig e pacote são obrigatórios.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const gigResult = await client.query('SELECT * FROM gigs WHERE id = $1', [gig_id]);
    if (gigResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Gig não encontrado.' });
    }
    const gig = gigResult.rows[0];

    if (String(gig.freelancer_id) === String(client_id)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Não podes comprar o teu próprio gig.' });
    }

    const pkgResult = await client.query('SELECT * FROM gig_packages WHERE id = $1 AND gig_id = $2', [package_id, gig_id]);
    if (pkgResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Pacote não encontrado.' });
    }
    const pkg = pkgResult.rows[0];

    let total = parseFloat(pkg.price);
    for (const extra of extras || []) {
      total += parseFloat(extra.price);
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + pkg.delivery_days);

    const orderResult = await client.query(
      `INSERT INTO orders (gig_id, package_id, client_id, freelancer_id, total_amount, requirements, delivery_date, status, revisions_allowed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8) RETURNING *`,
      [gig_id, package_id, client_id, gig.freelancer_id, total, requirements || '', deliveryDate, pkg.revisions || REVISION_LIMIT_DEFAULT]
    );
    const order = orderResult.rows[0];

    await Promise.all((extras || []).map(extra =>
      client.query('INSERT INTO order_extras (order_id, name, price) VALUES ($1, $2, $3)', [order.id, extra.name, extra.price])
    ));

    await client.query('UPDATE gigs SET orders_count = COALESCE(orders_count, 0) + 1 WHERE id = $1', [gig_id]);

    await client.query('COMMIT');

    setImmediate(() => {
      const io = req.app.get('io');
      if (io) {
        io.emit(`notification:${gig.freelancer_id}`, {
          type: 'order',
          title: 'Nova encomenda recebida! 🛒',
          body: `Recebeste uma encomenda de "${gig.title}" no valor de ${total.toLocaleString()} MT.`,
          url: '/orders',
        });
      }
    });

    res.status(201).json({ message: 'Encomenda criada com sucesso!', order });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar encomenda:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

const getOrders = async (req, res) => {
  const user_id = req.user.id;
  try {
    const { role, status } = req.query;
    let filter = '(o.client_id = $1 OR o.freelancer_id = $1)';
    const params = [user_id];

    if (role === 'buying') {
      filter = 'o.client_id = $1';
    } else if (role === 'selling') {
      filter = 'o.freelancer_id = $1';
    }
    if (status) {
      params.push(status);
      filter += ` AND o.status = $${params.length}`;
    }

    const result = await pool.query(
      `SELECT o.*, g.title as gig_title, g.image as gig_image,
        u1.name as client_name, u1.avatar as client_avatar,
        u2.name as freelancer_name, u2.avatar as freelancer_avatar
       FROM orders o
       JOIN gigs g ON o.gig_id = g.id
       JOIN users u1 ON o.client_id = u1.id
       JOIN users u2 ON o.freelancer_id = u2.id
       WHERE ${filter}
       ORDER BY o.created_at DESC`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar encomendas:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const [orderResult, extrasResult, deliveriesResult, revisionsResult] = await Promise.all([
      pool.query(
        `SELECT o.*, g.title as gig_title, g.image as gig_image,
          p.type as package_type, p.title as package_title, p.description as package_description,
          p.delivery_days, p.revisions,
          u1.name as client_name, u1.avatar as client_avatar,
          u2.name as freelancer_name, u2.avatar as freelancer_avatar
         FROM orders o
         JOIN gigs g ON o.gig_id = g.id
         JOIN gig_packages p ON o.package_id = p.id
         JOIN users u1 ON o.client_id = u1.id
         JOIN users u2 ON o.freelancer_id = u2.id
         WHERE o.id = $1 AND (o.client_id = $2 OR o.freelancer_id = $2)`,
        [id, user_id]
      ),
      pool.query('SELECT * FROM order_extras WHERE order_id = $1', [id]),
      pool.query('SELECT * FROM order_deliveries WHERE order_id = $1 ORDER BY created_at ASC', [id]),
      pool.query('SELECT * FROM order_revision_requests WHERE order_id = $1 ORDER BY created_at ASC', [id]),
    ]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Encomenda não encontrada.' });
    }

    res.json({
      order: orderResult.rows[0],
      extras: extrasResult.rows,
      deliveries: deliveriesResult.rows,
      revision_requests: revisionsResult.rows,
    });
  } catch (err) {
    console.error('Erro ao buscar encomenda:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: status só pode ser alterado para estados válidos pela parte certa
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user_id = req.user.id;

  const allowed = ['in_progress', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Estado inválido para esta operação.' });
  }

  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND (client_id = $2 OR freelancer_id = $2)',
      [id, user_id]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Encomenda não encontrada.' });
    }

    await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
    res.json({ message: 'Estado actualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao actualizar encomenda:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: Entrega de trabalho — só o freelancer pode entregar
const deliverOrder = async (req, res) => {
  const { id } = req.params;
  const { message, files } = req.body;
  const user_id = req.user.id;

  if (!message && (!files || files.length === 0)) {
    return res.status(400).json({ message: 'Adiciona uma mensagem ou pelo menos um ficheiro.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const order = await client.query('SELECT * FROM orders WHERE id = $1 AND freelancer_id = $2', [id, user_id]);
    if (order.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Encomenda não encontrada ou não te pertence.' });
    }
    if (!['pending', 'in_progress', 'revision_requested'].includes(order.rows[0].status)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Esta encomenda não pode ser entregue neste estado.' });
    }

    await client.query(
      'INSERT INTO order_deliveries (order_id, message, files) VALUES ($1, $2, $3)',
      [id, message || '', JSON.stringify(files || [])]
    );

    // Cliente tem 3 dias para pedir revisão ou aceitar, depois auto-completa
    const autoCompleteAt = new Date();
    autoCompleteAt.setDate(autoCompleteAt.getDate() + 3);

    await client.query(
      `UPDATE orders SET status = 'delivered', delivered_at = NOW(), auto_complete_at = $1, updated_at = NOW() WHERE id = $2`,
      [autoCompleteAt, id]
    );

    await client.query('COMMIT');

    setImmediate(() => {
      const io = req.app.get('io');
      if (io) {
        io.emit(`notification:${order.rows[0].client_id}`, {
          type: 'order',
          title: 'Trabalho entregue! 📦',
          body: 'O freelancer entregou o teu pedido. Revê e aprova ou pede uma revisão.',
          url: `/orders`,
        });
      }
    });

    res.json({ message: 'Entrega enviada com sucesso!' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao entregar encomenda:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

// FIX: Pedido de revisão — só o cliente pode pedir, respeita o limite de revisões
const requestRevision = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const user_id = req.user.id;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Descreve o que precisa ser revisto.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const order = await client.query('SELECT * FROM orders WHERE id = $1 AND client_id = $2', [id, user_id]);
    if (order.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Encomenda não encontrada ou não te pertence.' });
    }
    const o = order.rows[0];
    if (o.status !== 'delivered') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Só podes pedir revisão depois da entrega.' });
    }
    if (o.revisions_used >= o.revisions_allowed) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: `Atingiste o limite de ${o.revisions_allowed} revisões incluídas neste pacote.` });
    }

    await client.query('INSERT INTO order_revision_requests (order_id, message) VALUES ($1, $2)', [id, message.trim()]);
    await client.query(
      `UPDATE orders SET status = 'revision_requested', revisions_used = revisions_used + 1, auto_complete_at = NULL, updated_at = NOW() WHERE id = $1`,
      [id]
    );

    await client.query('COMMIT');

    setImmediate(() => {
      const io = req.app.get('io');
      if (io) {
        io.emit(`notification:${o.freelancer_id}`, {
          type: 'order',
          title: 'Revisão solicitada',
          body: 'O cliente pediu uma revisão no trabalho entregue.',
          url: '/orders',
        });
      }
    });

    res.json({ message: 'Pedido de revisão enviado.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao pedir revisão:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

// FIX: Aceitar entrega — completa a encomenda e processa o pagamento ao freelancer
const acceptDelivery = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const order = await client.query(
      `SELECT o.*, g.title as gig_title FROM orders o JOIN gigs g ON o.gig_id = g.id WHERE o.id = $1 AND o.client_id = $2 FOR UPDATE`,
      [id, user_id]
    );
    if (order.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Encomenda não encontrada ou não te pertence.' });
    }
    const o = order.rows[0];
    if (o.status !== 'delivered') {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Esta encomenda ainda não foi entregue.' });
    }

    const commission = parseFloat(o.total_amount) * 0.05;
    const freelancerReceives = parseFloat(o.total_amount) - commission;

    await client.query(
      `UPDATE orders SET status = 'completed', completed_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [id]
    );
    await client.query(
      `INSERT INTO payments (payer_id, receiver_id, amount, status, description) VALUES ($1, $2, $3, 'completed', $4)`,
      [user_id, o.freelancer_id, o.total_amount, `Encomenda: ${o.gig_title}`]
    );

    await client.query('COMMIT');

    setImmediate(async () => {
      try {
        await recalculateSellerLevel(o.freelancer_id);
        const freelancer = await pool.query('SELECT name, email FROM users WHERE id = $1', [o.freelancer_id]);
        if (freelancer.rows.length > 0) {
          sendPaymentEmail(freelancer.rows[0], freelancerReceives, o.gig_title);
        }
        const io = req.app.get('io');
        if (io) {
          io.emit(`notification:${o.freelancer_id}`, {
            type: 'payment',
            title: 'Encomenda concluída! 💰',
            body: `Recebeste ${freelancerReceives.toLocaleString()} MT pela encomenda "${o.gig_title}".`,
            url: '/payments',
          });
        }
      } catch (e) {
        console.error('Erro ao notificar conclusão:', e);
      }
    });

    res.json({ message: 'Encomenda concluída! O pagamento foi processado.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao aceitar entrega:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, deliverOrder, requestRevision, acceptDelivery, getAllOrdersAdmin };

async function getAllOrdersAdmin(req, res) {
  try {
    const result = await pool.query(
      `SELECT o.*, g.title as gig_title, g.image as gig_image,
        u1.name as client_name, u1.avatar as client_avatar,
        u2.name as freelancer_name, u2.avatar as freelancer_avatar
       FROM orders o
       JOIN gigs g ON o.gig_id = g.id
       JOIN users u1 ON o.client_id = u1.id
       JOIN users u2 ON o.freelancer_id = u2.id
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar encomendas (admin):', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}
