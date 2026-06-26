const pool = require("../config/db");

// Abrir disputa
const openDispute = async (req, res) => {
  const { contract_id, reason, description } = req.body;
  const userId = req.user.id;
  try {
    // Verifica se o contrato existe e o utilizador faz parte dele
    const contract = await pool.query(
      "SELECT * FROM contracts WHERE id = $1 AND (client_id = $2 OR freelancer_id = $2)",
      [contract_id, userId]
    );
    if (contract.rows.length === 0) {
      return res.status(404).json({ message: "Contrato nao encontrado ou sem permissao." });
    }
    // Verifica se ja existe disputa aberta
    const existing = await pool.query(
      "SELECT * FROM disputes WHERE contract_id = $1 AND status = $2",
      [contract_id, "open"]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Ja existe uma disputa aberta para este contrato." });
    }
    const result = await pool.query(
      `INSERT INTO disputes (contract_id, opened_by, reason, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [contract_id, userId, reason, description]
    );
    // Notificacao Socket.io para o admin
    const io = req.app.get("io");
    if (io) {
      io.emit("notification:admin", {
        type: "dispute",
        title: "Nova disputa aberta!",
        body: `Disputa aberta no contrato #${contract_id}`,
        url: "/admin",
      });
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao abrir disputa:", err);
    res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
};

// Listar disputas do utilizador
const getMyDisputes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, 
        c.project_id,
        proj.title as project_title,
        u1.name as opened_by_name,
        u2.name as resolved_by_name
       FROM disputes d
       JOIN contracts c ON d.contract_id = c.id
       JOIN projects proj ON c.project_id = proj.id
       JOIN users u1 ON d.opened_by = u1.id
       LEFT JOIN users u2 ON d.resolved_by = u2.id
       WHERE c.client_id = $1 OR c.freelancer_id = $1
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
        proj.title as project_title,
        u1.name as opened_by_name,
        uc.name as client_name,
        uf.name as freelancer_name
       FROM disputes d
       JOIN contracts c ON d.contract_id = c.id
       JOIN projects proj ON c.project_id = proj.id
       JOIN users u1 ON d.opened_by = u1.id
       JOIN users uc ON c.client_id = uc.id
       JOIN users uf ON c.freelancer_id = uf.id
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