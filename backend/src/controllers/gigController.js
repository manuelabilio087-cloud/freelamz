const pool = require('../config/db');

const createGig = async (req, res) => {
  const { title, category, description, image, tags, packages } = req.body;
  const freelancer_id = req.user.id;

  // FIX: Validação de input
  if (!title || !category || !description) {
    return res.status(400).json({ message: 'Título, categoria e descrição são obrigatórios.' });
  }
  if (!packages || !Array.isArray(packages) || packages.length === 0) {
    return res.status(400).json({ message: 'Pelo menos um pacote é obrigatório.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const gigResult = await client.query(
      'INSERT INTO gigs (freelancer_id, title, category, description, image, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [freelancer_id, title, category, description, image, tags]
    );
    const gig = gigResult.rows[0];

    // FIX: Inserção de pacotes com Promise.all em vez de loop sequencial
    await Promise.all(packages.map(pkg =>
      client.query(
        'INSERT INTO gig_packages (gig_id, type, title, description, price, delivery_days, revisions, features) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [gig.id, pkg.type, pkg.title, pkg.description, pkg.price, pkg.delivery_days, pkg.revisions, pkg.features]
      )
    ));

    await client.query('COMMIT');
    res.status(201).json({ message: 'Gig criado com sucesso!', gig });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar gig:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

const getGigs = async (req, res) => {
  try {
    const { category, min_price, max_price, search } = req.query;
    // FIX: Paginação adicionada
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    let query = `
      SELECT g.*, u.name as freelancer_name, u.avatar as freelancer_avatar,
        (SELECT MIN(price) FROM gig_packages WHERE gig_id = g.id) as starting_price
      FROM gigs g
      JOIN users u ON g.freelancer_id = u.id
      WHERE g.status = 'active'
    `;
    const params = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND g.category = $${paramCount}`;
      params.push(category);
    }
    if (search) {
      paramCount++;
      query += ` AND (g.title ILIKE $${paramCount} OR g.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }
    if (min_price) {
      paramCount++;
      query += ` AND (SELECT MIN(price) FROM gig_packages WHERE gig_id = g.id) >= $${paramCount}`;
      params.push(min_price);
    }
    if (max_price) {
      paramCount++;
      query += ` AND (SELECT MIN(price) FROM gig_packages WHERE gig_id = g.id) <= $${paramCount}`;
      params.push(max_price);
    }

    paramCount++;
    query += ` ORDER BY g.created_at DESC LIMIT $${paramCount}`;
    params.push(limit);
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar gigs:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getGigById = async (req, res) => {
  const { id } = req.params;
  try {
    // FIX: Queries em paralelo para melhor performance
    const [gigResult, packagesResult, reviewsResult] = await Promise.all([
      pool.query(
        'SELECT g.*, u.name as freelancer_name, u.avatar as freelancer_avatar, u.bio as freelancer_bio FROM gigs g JOIN users u ON g.freelancer_id = u.id WHERE g.id = $1',
        [id]
      ),
      pool.query('SELECT * FROM gig_packages WHERE gig_id = $1 ORDER BY price ASC', [id]),
      pool.query(
        `SELECT r.*, u.name as reviewer_name FROM order_reviews r
         JOIN users u ON r.reviewer_id = u.id
         JOIN gigs g ON g.freelancer_id = r.reviewed_id
         WHERE g.id = $1 LIMIT 20`,
        [id]
      ),
    ]);

    if (gigResult.rows.length === 0) {
      return res.status(404).json({ message: 'Gig não encontrado.' });
    }

    res.json({
      gig: gigResult.rows[0],
      packages: packagesResult.rows,
      reviews: reviewsResult.rows
    });
  } catch (err) {
    console.error('Erro ao buscar gig:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { createGig, getGigs, getGigById };
