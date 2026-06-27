const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const isClient = req.user.role === "client";

    let query;
    let params;

    if (isClient) {
      query = `
        SELECT 
          p.id as project_id,
          p.title as project_title,
          p.status,
          p.created_at,
          pr.id as proposal_id,
          pr.price,
          pr.delivery,
          pr.status as proposal_status,
          f.id as freelancer_id,
          f.name as freelancer_name,
          f.avatar as freelancer_avatar,
          EXISTS (
            SELECT 1 FROM reviews r 
            WHERE r.client_id = $1 AND r.freelancer_id = f.id AND r.project_id = p.id
          ) as reviewed
        FROM projects p
        JOIN proposals pr ON pr.project_id = p.id AND pr.status = 'accepted'
        JOIN users f ON f.id = pr.freelancer_id
        WHERE p.client_id = $1
        ORDER BY p.created_at DESC
      `;
      params = [userId];
    } else {
      query = `
        SELECT 
          p.id as project_id,
          p.title as project_title,
          p.status,
          p.created_at,
          pr.id as proposal_id,
          pr.price,
          pr.delivery,
          pr.status as proposal_status,
          c.id as client_id,
          c.name as client_name,
          c.avatar as client_avatar,
          EXISTS (
            SELECT 1 FROM reviews r 
            WHERE r.client_id = c.id AND r.freelancer_id = $1 AND r.project_id = p.id
          ) as reviewed
        FROM proposals pr
        JOIN projects p ON p.id = pr.project_id
        JOIN users c ON c.id = p.client_id
        WHERE pr.freelancer_id = $1 AND pr.status = 'accepted'
        ORDER BY p.created_at DESC
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar contratos" });
  }
});

module.exports = router;