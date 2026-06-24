const pool = require('../config/db');

const createGig = async (req, res) => {
  const { title, category, description, image, tags, packages } = req.body;
  const freelancer_id = req.user.id;

  try {
    const gigResult = await pool.query(
      'INSERT INTO gigs (freelancer_id, title, category, description, image, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [freelancer_id, title, category, description, image, tags]
    );

    const gig = gigResult.rows[0];

    for (const pkg of packages) {
      await pool.query(
        'INSERT INTO gig_packages (gig_id, type, title, description, price, delivery_days, revisions, features) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [gig.id, pkg.type, pkg.title, pkg.description, pkg.price, pkg.delivery_days, pkg.revisions, pkg.features]
      );
    }

    res.status(201).json({ message: 'Gig criado com sucesso!', gig });
  } catch (err) {
    console.error('Erro ao criar gig:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getGigs = async (req, res) => {
  try {
    const { category, min_price, max_price, search } = req.query;
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

    query += ' ORDER BY g.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar gigs:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getGigById = async (req, res) => {
  const { id } = req.params;

  try {
    const gigResult = await pool.query(
      'SELECT g.*, u.name as freelancer_name, u.avatar as freelancer_avatar, u.bio as freelancer_bio FROM gigs g JOIN users u ON g.freelancer_id = u.id WHERE g.id = $1',
      [id]
    );

    if (gigResult.rows.length === 0) {
      return res.status(404).json({ message: 'Gig nao encontrado.' });
    }

    const packagesResult = await pool.query(
      'SELECT * FROM gig_packages WHERE gig_id = $1 ORDER BY price ASC',
      [id]
    );

    const reviewsResult = await pool.query(
      'SELECT r.*, u.name as reviewer_name FROM order_reviews r JOIN users u ON r.reviewer_id = u.id WHERE r.reviewed_id = $1',
      [gigResult.rows[0].freelancer_id]
    );

    res.json({
      gig: gigResult.rows[0],
      packages: packagesResult.rows,
      reviews: reviewsResult.rows
    });
  } catch (err) {
    console.error('Erro ao buscar gig:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { createGig, getGigs, getGigById };
