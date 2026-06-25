const pool = require('../config/db');

const createReview = async (req, res) => {
  const { freelancer_id, rating, comment, project_id } = req.body;
  const client_id = req.user.id;

  try {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Avaliacao deve ser entre 1 e 5.' });
    }

    const existing = await pool.query(
      'SELECT * FROM reviews WHERE client_id = $1 AND freelancer_id = $2 AND project_id = $3',
      [client_id, freelancer_id, project_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Ja avaliaste este freelancer neste projecto.' });
    }

    const review = await pool.query(
      `INSERT INTO reviews (client_id, freelancer_id, rating, comment, project_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [client_id, freelancer_id, rating, comment, project_id]
    );

    res.status(201).json(review.rows[0]);
  } catch (err) {
    console.error('Erro ao criar review:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getFreelancerReviews = async (req, res) => {
  const { freelancer_id } = req.params;

  try {
    const reviews = await pool.query(
      `SELECT r.*, u.name as client_name
       FROM reviews r
       JOIN users u ON r.client_id = u.id
       WHERE r.freelancer_id = $1
       ORDER BY r.created_at DESC`,
      [freelancer_id]
    );

    const avgResult = await pool.query(
      'SELECT AVG(rating)::numeric(10,1) as avg_rating, COUNT(*) as total FROM reviews WHERE freelancer_id = $1',
      [freelancer_id]
    );

    res.json({
      reviews: reviews.rows,
      avg_rating: avgResult.rows[0].avg_rating || 0,
      total: avgResult.rows[0].total
    });
  } catch (err) {
    console.error('Erro ao buscar reviews:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getMyReviews = async (req, res) => {
  const freelancer_id = req.user.id;

  try {
    const reviews = await pool.query(
      `SELECT r.*, u.name as client_name
       FROM reviews r
       JOIN users u ON r.client_id = u.id
       WHERE r.freelancer_id = $1
       ORDER BY r.created_at DESC`,
      [freelancer_id]
    );

    const avgResult = await pool.query(
      'SELECT AVG(rating)::numeric(10,1) as avg_rating, COUNT(*) as total FROM reviews WHERE freelancer_id = $1',
      [freelancer_id]
    );

    res.json({
      reviews: reviews.rows,
      avg_rating: avgResult.rows[0].avg_rating || 0,
      total: avgResult.rows[0].total
    });
  } catch (err) {
    console.error('Erro ao buscar reviews:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { createReview, getFreelancerReviews, getMyReviews };