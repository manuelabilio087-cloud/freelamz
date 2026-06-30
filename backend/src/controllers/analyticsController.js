const pool = require('../config/db');

const getGigAnalytics = async (req, res) => {
  const { gigId } = req.params;
  const user_id = req.user.id;
  try {
    const gig = await pool.query('SELECT id, title, views_count, orders_count FROM gigs WHERE id = $1 AND freelancer_id = $2', [gigId, user_id]);
    if (gig.rows.length === 0) {
      return res.status(404).json({ message: 'Gig não encontrado ou não te pertence.' });
    }

    const daily = await pool.query(
      `SELECT date, views, clicks, orders FROM gig_analytics WHERE gig_id = $1 ORDER BY date DESC LIMIT 30`,
      [gigId]
    );

    const conversionRate = gig.rows[0].views_count > 0
      ? ((gig.rows[0].orders_count / gig.rows[0].views_count) * 100).toFixed(2)
      : 0;

    res.json({
      gig: gig.rows[0],
      conversion_rate: parseFloat(conversionRate),
      daily_stats: daily.rows,
    });
  } catch (err) {
    console.error('Erro ao buscar analytics do gig:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// FIX: Dashboard de analytics geral do freelancer — todos os gigs
const getSellerAnalytics = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [gigs, totals] = await Promise.all([
      pool.query(
        `SELECT id, title, views_count, orders_count,
          (SELECT MIN(price) FROM gig_packages WHERE gig_id = gigs.id) as starting_price
         FROM gigs WHERE freelancer_id = $1 ORDER BY views_count DESC`,
        [user_id]
      ),
      pool.query(
        `SELECT COALESCE(SUM(views_count),0) as total_views, COALESCE(SUM(orders_count),0) as total_orders
         FROM gigs WHERE freelancer_id = $1`,
        [user_id]
      ),
    ]);

    res.json({
      gigs: gigs.rows,
      total_views: parseInt(totals.rows[0].total_views),
      total_orders: parseInt(totals.rows[0].total_orders),
      conversion_rate: totals.rows[0].total_views > 0
        ? parseFloat(((totals.rows[0].total_orders / totals.rows[0].total_views) * 100).toFixed(2))
        : 0,
    });
  } catch (err) {
    console.error('Erro ao buscar analytics do vendedor:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { getGigAnalytics, getSellerAnalytics };
