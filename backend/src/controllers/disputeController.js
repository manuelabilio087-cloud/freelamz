const pool = require("../config/db");

// Abrir disputa - suporta tanto orders (gig-flow) como contracts (project-flow)
const openDispute = async (req, res) => {
  const { order_id, contract_id, reason, description } = req.body;
  const userId = req.user.id;

  if (!reason || !description) {
    return res.status(400).json({ message: "Motivo e descricao sao obrigatorios." });
  }
  if (!order_id && !contract_id) {
    return res.status(400).json({ message: "E necessario indicar order_id ou contract_id." });
  }
  if (order_id && contract_id) {
    return res.status(400).json({ message: "Indica apenas order_id OU contract_id, nao ambos." });
  }

  try {
    if (order_id) {
      const order = await pool.query(
        "SELECT * FROM orders WHERE id = $1 AND (client_id = $2 OR freelancer_id = $2)",
        [order_id, userId]
      );
      if (order.rows.length === 0) {
        return res.status(404).json({ message: "Encomenda nao encontrada ou sem permissao." });
      }
    } else {
      const contract = await pool.query(
        "SELECT * FROM contracts WHERE id = $1 AND (client_id = $2 OR freelancer_id = $2)",
        [contract_id, userId]
      );
      if (contract.rows.length === 0) {
        return res.status(404).json({ message: "Contrato nao encontrado ou sem permissao." });
      }
    }

    const existing = await pool.query(
      `SELECT * FROM disputes WHERE status = 'open' AND (
        (order_id = $1 AND $1 IS NOT NULL) OR (contract_id = $2 AND $2 IS NOT NULL)
      )`,
      [order_id || null, contract_id || null]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Ja existe uma disputa aberta para isto." });
    }

    const result = await pool.query(
      `INSERT INTO disputes (order_id, contract_id, opened_by, reason, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [order_id || null, contract_id || null, userId, reason, description]
    );

    const io = req.app.get("io");
    if (io) {
      io.emit("notification:admin", {
        type: "dispute",
        title: "Nova disputa aberta!",
        body: order_id ? `Disputa aberta na encomenda #${order_id}` : `Disputa aberta no contrato #${contract_id}`,
        url: "/admin",
      });
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao abrir disputa:", err);
    res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
};

// Listar disputas do utilizador (orders + contracts)
const getMyDisputes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*,
        c.project_id,
        COALESCE(proj.title, g.title) as title,
        u1.name as opened_by_name,
        u2.name as resolved_by_name
       FROM disputes d
       LEFT JOIN contracts c ON d.contract_id = c.id
       LEFT JOIN projects proj ON c.project_id = proj.id
       LEFT JOIN orders o ON d.order_id = o.id
       LEFT JOIN gigs g ON o.gig_id = g.id
       JOIN users u1 ON d.opened_by = u1.id
       LEFT JOIN users u2 ON d.resolved_by = u2.id
       WHERE (c.client_id = $1 OR c.freelancer_id = $1 OR o.client_id = $1 OR o.freelancer_id = $1)
       ORDER BY d.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar disputas:", err);
    res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
};

// Listar todas as disputas (admin)
const getAllDisputes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*,
        c.project_id,
        COALESCE(proj.title, g.title) as title,
        u1.name as opened_by_name,
        COALESCE(uc.name, oc.name) as client_name,
        COALESCE(uf.name, ofl.name) as freelancer_name
       FROM disputes d
       LEFT JOIN contracts c ON d.contract_id = c.id
       LEFT JOIN projects proj ON c.project_id = proj.id
       LEFT JOIN users uc ON c.client_id = uc.id
       LEFT JOIN users uf ON c.freelancer_id = uf.id
       LEFT JOIN orders o ON d.order_id = o.id
       LEFT JOIN gigs g ON o.gig_id = g.id
       LEFT JOIN users oc ON o.client_id = oc.id
       LEFT JOIN users ofl ON o.freelancer_id = ofl.id
       JOIN users u1 ON d.opened_by = u1.id
       ORDER BY d.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar disputas:", err);
    res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
};

// Resolver disputa (admin)
const resolveDispute = async (req, res) => {
  const { resolution, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE disputes SET resolution = $1, status = $2, resolved_by = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [resolution, status || "resolved", req.user.id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Disputa nao encontrada." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao resolver disputa:", err);
    res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
};

module.exports = { openDispute, getMyDisputes, getAllDisputes, resolveDispute };
