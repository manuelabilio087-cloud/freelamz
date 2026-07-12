const pool = require('../config/db');

const createGig = async (req, res) => {
  const { title, category, category_id, description, image, tags, packages } = req.body;
  const freelancer_id = req.user.id;

  // Qualquer utilizador autenticado pode publicar um gig (modelo flexível:
  // um "cliente" também pode oferecer serviços, tal como um "freelancer" também pode contratar)

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
      'INSERT INTO gigs (freelancer_id, title, category, category_id, description, image, tags) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [freelancer_id, title, category, category_id || null, description, image, tags]
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
    const { category, category_slug, min_price, max_price, search, min_rating, max_delivery_days, sort, freelancer_id } = req.query;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    let query = `
      SELECT g.*, u.name as freelancer_name, u.avatar as freelancer_avatar, u.verified as freelancer_verified,
        u.seller_level,
        (SELECT MIN(price) FROM gig_packages WHERE gig_id = g.id) as starting_price,
        (SELECT MIN(delivery_days) FROM gig_packages WHERE gig_id = g.id) as fastest_delivery,
        (SELECT COALESCE(AVG(rating),0) FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.gig_id = g.id) as avg_rating,
        (SELECT COUNT(*) FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.gig_id = g.id) as review_count
      FROM gigs g
      JOIN users u ON g.freelancer_id = u.id
      WHERE g.status = 'active'
    `;
    const params = [];
    let paramCount = 0;

    if (freelancer_id) {
      paramCount++;
      query += ` AND g.freelancer_id = $${paramCount}`;
      params.push(freelancer_id);
    }
    if (category) {
      paramCount++;
      query += ` AND g.category_id = $${paramCount}`;
      params.push(category);
    }
    if (category_slug) {
      paramCount++;
      query += ` AND g.category_id = (SELECT id FROM categories WHERE slug = $${paramCount})`;
      params.push(category_slug);
    }
    if (search) {
      paramCount++;
      query += ` AND (g.title ILIKE $${paramCount} OR g.description ILIKE $${paramCount} OR g.tags ILIKE $${paramCount})`;
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
    if (max_delivery_days) {
      paramCount++;
      query += ` AND (SELECT MIN(delivery_days) FROM gig_packages WHERE gig_id = g.id) <= $${paramCount}`;
      params.push(max_delivery_days);
    }
    if (min_rating) {
      paramCount++;
      query += ` AND (SELECT COALESCE(AVG(rating),0) FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.gig_id = g.id) >= $${paramCount}`;
      params.push(min_rating);
    }

    const sortOptions = {
      newest: 'g.created_at DESC',
      price_asc: 'starting_price ASC',
      price_desc: 'starting_price DESC',
      rating: 'avg_rating DESC',
      popular: 'g.orders_count DESC',
    };
    query += ` ORDER BY ${sortOptions[sort] || sortOptions.newest}`;

    paramCount++;
    query += ` LIMIT $${paramCount}`;
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

const getFeaturedGigs = async (req, res) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit) || 8);
    const result = await pool.query(
      `SELECT g.*, u.name as freelancer_name, u.avatar as freelancer_avatar, u.seller_level,
        (SELECT MIN(price) FROM gig_packages WHERE gig_id = g.id) as starting_price,
        (SELECT COALESCE(AVG(rating),0) FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.gig_id = g.id) as avg_rating,
        (SELECT COUNT(*) FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.gig_id = g.id) as review_count
       FROM gigs g
       JOIN users u ON g.freelancer_id = u.id
       WHERE g.status = 'active'
       ORDER BY g.orders_count DESC, g.views_count DESC
       LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar gigs em destaque:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getGigById = async (req, res) => {
  const { id } = req.params;
  try {
    const [gigResult, packagesResult, reviewsResult] = await Promise.all([
      pool.query(
        'SELECT g.*, u.name as freelancer_name, u.avatar as freelancer_avatar, u.bio as freelancer_bio, u.seller_level, u.verified as freelancer_verified FROM gigs g JOIN users u ON g.freelancer_id = u.id WHERE g.id = $1',
        [id]
      ),
      pool.query('SELECT * FROM gig_packages WHERE gig_id = $1 ORDER BY price ASC', [id]),
      pool.query(
        `SELECT r.*, u.name as reviewer_name FROM order_reviews r
         JOIN users u ON r.reviewer_id = u.id
         JOIN orders o ON r.order_id = o.id
         WHERE o.gig_id = $1 ORDER BY r.created_at DESC LIMIT 20`,
        [id]
      ),
    ]);

    if (gigResult.rows.length === 0) {
      return res.status(404).json({ message: 'Gig não encontrado.' });
    }

    pool.query('UPDATE gigs SET views_count = COALESCE(views_count, 0) + 1 WHERE id = $1', [id]).catch(() => {});

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

const getMyGigs = async (req, res) => {
  try {
    const freelancer_id = req.user.id;
    const result = await pool.query(
      `SELECT g.*,
        (SELECT MIN(price) FROM gig_packages WHERE gig_id = g.id) as starting_price,
        (SELECT MIN(delivery_days) FROM gig_packages WHERE gig_id = g.id) as fastest_delivery,
        (SELECT COALESCE(AVG(rating),0) FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.gig_id = g.id) as avg_rating,
        (SELECT COUNT(*) FROM order_reviews r JOIN orders o ON r.order_id = o.id WHERE o.gig_id = g.id) as review_count
       FROM gigs g
       WHERE g.freelancer_id = $1
       ORDER BY g.created_at DESC`,
      [freelancer_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar os meus gigs:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { createGig, getGigs, getFeaturedGigs, getGigById, getAllGigsAdmin, deleteGig, getMyGigs };

async function getAllGigsAdmin(req, res) {
  try {
    const result = await pool.query(
      `SELECT g.*, u.name as freelancer_name, u.avatar as freelancer_avatar,
        (SELECT MIN(price) FROM gig_packages WHERE gig_id = g.id) as starting_price
       FROM gigs g
       JOIN users u ON g.freelancer_id = u.id
       ORDER BY g.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar gigs (admin):', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}

async function deleteGig(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM gigs WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Gig não encontrado.' });
    }
    res.json({ message: 'Gig removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover gig:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
}
