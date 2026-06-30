const pool = require('../config/db');

const addPortfolioItem = async (req, res) => {
  const { title, description, image_url, project_url } = req.body;
  const user_id = req.user.id;

  if (!title || !image_url) {
    return res.status(400).json({ message: 'Título e imagem são obrigatórios.' });
  }

  try {
    const count = await pool.query('SELECT COUNT(*) FROM portfolio_items WHERE user_id = $1', [user_id]);
    if (parseInt(count.rows[0].count) >= 20) {
      return res.status(400).json({ message: 'Limite de 20 itens no portfólio atingido.' });
    }

    const result = await pool.query(
      'INSERT INTO portfolio_items (user_id, title, description, image_url, project_url, display_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, title, description || '', image_url, project_url || '', parseInt(count.rows[0].count)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao adicionar item de portfólio:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getPortfolioByUser = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM portfolio_items WHERE user_id = $1 ORDER BY display_order ASC, created_at DESC',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar portfólio:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const deletePortfolioItem = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM portfolio_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado.' });
    }
    res.json({ message: 'Item removido.' });
  } catch (err) {
    console.error('Erro ao remover item de portfólio:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { addPortfolioItem, getPortfolioByUser, deletePortfolioItem };
