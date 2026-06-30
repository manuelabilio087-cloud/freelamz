const pool = require('../config/db');

// FIX: Calcula e atualiza o nível de vendedor baseado em métricas reais
// Critérios inspirados no Fiverr: encomendas concluídas, rating, tempo na plataforma
const recalculateSellerLevel = async (userId) => {
  try {
    const [completedOrders, avgRating, completionRate, memberSince] = await Promise.all([
      pool.query(`SELECT COUNT(*) as count FROM orders WHERE freelancer_id = $1 AND status = 'completed'`, [userId]),
      pool.query(
        `SELECT COALESCE(AVG(rating), 0) as avg FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.freelancer_id = $1`,
        [userId]
      ),
      pool.query(
        `SELECT
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COUNT(*) FILTER (WHERE status IN ('completed','cancelled')) as total
         FROM orders WHERE freelancer_id = $1`,
        [userId]
      ),
      pool.query('SELECT member_since FROM users WHERE id = $1', [userId]),
    ]);

    const completed = parseInt(completedOrders.rows[0].count);
    const rating = parseFloat(avgRating.rows[0].avg);
    const total = parseInt(completionRate.rows[0].total) || 1;
    const completedRatio = parseInt(completionRate.rows[0].completed) / total;
    const daysSinceMember = memberSince.rows[0]?.member_since
      ? Math.floor((Date.now() - new Date(memberSince.rows[0].member_since)) / (1000 * 60 * 60 * 24))
      : 0;

    let level = 'new';
    if (completed >= 50 && rating >= 4.7 && completedRatio >= 0.9 && daysSinceMember >= 180) {
      level = 'top_rated';
    } else if (completed >= 10 && rating >= 4.5 && completedRatio >= 0.8 && daysSinceMember >= 60) {
      level = 'level_2';
    } else if (completed >= 1 && rating >= 4.0 && completedRatio >= 0.7 && daysSinceMember >= 30) {
      level = 'level_1';
    }

    await pool.query(
      'UPDATE users SET seller_level = $1, completion_rate = $2 WHERE id = $3',
      [level, (completedRatio * 100).toFixed(2), userId]
    );

    return level;
  } catch (err) {
    console.error('Erro ao recalcular nível de vendedor:', err);
    return null;
  }
};

module.exports = { recalculateSellerLevel };
