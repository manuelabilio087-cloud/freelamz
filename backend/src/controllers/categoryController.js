const pool = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(g.id) as gig_count
       FROM categories c
       LEFT JOIN gigs g ON g.category_id = c.id AND g.status = 'active'
       GROUP BY c.id
       ORDER BY c.display_order ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar categoria:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { getCategories, getCategoryBySlug };
