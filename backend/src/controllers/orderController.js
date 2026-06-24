const pool = require('../config/db');

const createOrder = async (req, res) => {
  const { gig_id, package_id, extras, requirements } = req.body;
  const client_id = req.user.id;

  try {
    const gigResult = await pool.query('SELECT * FROM gigs WHERE id = $1', [gig_id]);
    if (gigResult.rows.length === 0) {
      return res.status(404).json({ message: 'Gig nao encontrado.' });
    }

    const pkgResult = await pool.query('SELECT * FROM gig_packages WHERE id = $1', [package_id]);
    if (pkgResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pacote nao encontrado.' });
    }

    const gig = gigResult.rows[0];
    const pkg = pkgResult.rows[0];
    let total = parseFloat(pkg.price);

    for (const extra of extras || []) {
      total += parseFloat(extra.price);
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + pkg.delivery_days);

    const orderResult = await pool.query(
      'INSERT INTO orders (gig_id, package_id, client_id, freelancer_id, total_amount, requirements, delivery_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [gig_id, package_id, client_id, gig.freelancer_id, total, requirements, deliveryDate]
    );

    const order = orderResult.rows[0];

    for (const extra of extras || []) {
      await pool.query(
        'INSERT INTO order_extras (order_id, name, price) VALUES ($1, $2, $3)',
        [order.id, extra.name, extra.price]
      );
    }

    res.status(201).json({ message: 'Pedido criado com sucesso!', order });
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getOrders = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(`
      SELECT o.*, g.title as gig_title, g.image as gig_image, 
        u1.name as client_name, u2.name as freelancer_name
      FROM orders o
      JOIN gigs g ON o.gig_id = g.id
      JOIN users u1 ON o.client_id = u1.id
      JOIN users u2 ON o.freelancer_id = u2.id
      WHERE o.client_id = $1 OR o.freelancer_id = $1
      ORDER BY o.created_at DESC
    `, [user_id]);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const result = await pool.query(`
      SELECT o.*, g.title as gig_title, g.image as gig_image,
        p.type as package_type, p.title as package_title, p.description as package_description,
        p.delivery_days, p.revisions,
        u1.name as client_name, u2.name as freelancer_name
      FROM orders o
      JOIN gigs g ON o.gig_id = g.id
      JOIN gig_packages p ON o.package_id = p.id
      JOIN users u1 ON o.client_id = u1.id
      JOIN users u2 ON o.freelancer_id = u2.id
      WHERE o.id = $1 AND (o.client_id = $2 OR o.freelancer_id = $2)
    `, [id, user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido nao encontrado.' });
    }

    const extrasResult = await pool.query('SELECT * FROM order_extras WHERE order_id = $1', [id]);

    res.json({ order: result.rows[0], extras: extrasResult.rows });
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user_id = req.user.id;

  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND (client_id = $2 OR freelancer_id = $2)',
      [id, user_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido nao encontrado.' });
    }

    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    res.json({ message: 'Status atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar pedido:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
