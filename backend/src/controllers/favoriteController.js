const pool = require('../config/db');

const addFavorite = async (req, res) => {
  const { gig_id, freelancer_id } = req.body;
  const user_id = req.user.id;

  if (!gig_id && !freelancer_id) {
    return res.status(400).json({ message: 'Indica um gig ou freelancer para guardar.' });
  }
  if (gig_id && freelancer_id) {
    return res.status(400).json({ message: 'Indica apenas um: gig ou freelancer.' });
  }

  try {
    if (freelancer_id && String(freelancer_id) === String(user_id)) {
      return res.status(400).json({ message: 'Não podes guardar-te a ti próprio.' });
    }
    const result = await pool.query(
      `INSERT INTO favorites (user_id, gig_id, freelancer_id) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING RETURNING *`,
      [user_id, gig_id || null, freelancer_id || null]
    );
    res.status(201).json({ message: 'Adicionado aos favoritos.', favorite: result.rows[0] || null });
  } catch (err) {
    console.error('Erro ao adicionar favorito:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const removeFavorite = async (req, res) => {
  const { gig_id, freelancer_id } = req.query;
  const user_id = req.user.id;
  try {
    if (gig_id) {
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND gig_id = $2', [user_id, gig_id]);
    } else if (freelancer_id) {
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND freelancer_id = $2', [user_id, freelancer_id]);
    } else {
      return res.status(400).json({ message: 'Indica um gig ou freelancer para remover.' });
    }
    res.json({ message: 'Removido dos favoritos.' });
  } catch (err) {
    console.error('Erro ao remover favorito:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getMyFavorites = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [gigs, freelancers] = await Promise.all([
      pool.query(
        `SELECT f.id as favorite_id, g.*, u.name as freelancer_name, u.avatar as freelancer_avatar,
          (SELECT MIN(price) FROM gig_packages WHERE gig_id = g.id) as starting_price
         FROM favorites f JOIN gigs g ON f.gig_id = g.id JOIN users u ON g.freelancer_id = u.id
         WHERE f.user_id = $1 ORDER BY f.created_at DESC`,
        [user_id]
      ),
      pool.query(
        `SELECT f.id as favorite_id, u.id, u.name, u.bio, u.avatar, u.location, u.verified, u.seller_level
         FROM favorites f JOIN users u ON f.freelancer_id = u.id
         WHERE f.user_id = $1 ORDER BY f.created_at DESC`,
        [user_id]
      ),
    ]);
    res.json({ gigs: gigs.rows, freelancers: freelancers.rows });
  } catch (err) {
    console.error('Erro ao buscar favoritos:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { addFavorite, removeFavorite, getMyFavorites };
