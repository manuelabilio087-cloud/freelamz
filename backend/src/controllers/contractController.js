const pool = require('../config/db');

const createContract = async (req, res) => {
  const { project_id, freelancer_id, terms, milestones } = req.body;
  const client_id = req.user.id;

  if (!project_id || !freelancer_id || !terms) {
    return res.status(400).json({ message: 'Projecto, freelancer e termos são obrigatórios.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const project = await client.query(
      'SELECT * FROM projects WHERE id = $1 AND client_id = $2',
      [project_id, client_id]
    );
    if (project.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Projecto não encontrado ou não te pertence.' });
    }
    // FIX: Verifica que o freelancer existe e tem role correcto
    const freelancerCheck = await client.query(
      "SELECT id FROM users WHERE id = $1 AND role = 'freelancer'",
      [freelancer_id]
    );
    if (freelancerCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Freelancer não encontrado.' });
    }

    const existing = await client.query('SELECT id FROM contracts WHERE project_id = $1', [project_id]);
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Já existe um contrato para este projecto.' });
    }

    const result = await client.query(
      `INSERT INTO contracts (project_id, client_id, freelancer_id, terms, milestones, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [project_id, client_id, freelancer_id, terms, JSON.stringify(milestones || [])]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Contrato criado com sucesso.', contract: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar contrato:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

const getMyContracts = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT c.*,
        p.title as project_title, p.budget as project_budget,
        uc.name as client_name, uf.name as freelancer_name
       FROM contracts c
       JOIN projects p ON c.project_id = p.id
       JOIN users uc ON c.client_id = uc.id
       JOIN users uf ON c.freelancer_id = uf.id
       WHERE c.client_id = $1 OR c.freelancer_id = $1
       ORDER BY c.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar contratos:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getContract = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.*,
        p.title as project_title, p.budget as project_budget, p.description as project_description,
        uc.name as client_name, uf.name as freelancer_name
       FROM contracts c
       JOIN projects p ON c.project_id = p.id
       JOIN users uc ON c.client_id = uc.id
       JOIN users uf ON c.freelancer_id = uf.id
       WHERE c.id = $1 AND (c.client_id = $2 OR c.freelancer_id = $2)`,
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contrato não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar contrato:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const signContract = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const contract = await client.query('SELECT * FROM contracts WHERE id = $1 FOR UPDATE', [id]);
    if (contract.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Contrato não encontrado.' });
    }

    const c = contract.rows[0];
    let updateField, timestampField;
    if (c.client_id === userId) {
      if (c.client_signed) { await client.query('ROLLBACK'); return res.status(400).json({ message: 'Já assinaste este contrato.' }); }
      updateField = 'client_signed';
      timestampField = 'client_signed_at';
    } else if (c.freelancer_id === userId) {
      if (c.freelancer_signed) { await client.query('ROLLBACK'); return res.status(400).json({ message: 'Já assinaste este contrato.' }); }
      updateField = 'freelancer_signed';
      timestampField = 'freelancer_signed_at';
    } else {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Não tens permissão para assinar este contrato.' });
    }

    const updated = await client.query(
      `UPDATE contracts SET ${updateField} = true, ${timestampField} = NOW(),
        status = CASE
          WHEN (client_signed = true OR $1 = 'client_signed') AND (freelancer_signed = true OR $1 = 'freelancer_signed') THEN 'active'
          ELSE 'partially_signed'
        END
       WHERE id = $2 RETURNING *`,
      [updateField, id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Contrato assinado com sucesso.', contract: updated.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro ao assinar contrato:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  } finally {
    client.release();
  }
};

const updateMilestone = async (req, res) => {
  const { id } = req.params;
  const { milestone_index, status } = req.body;
  const userId = req.user.id;

  const allowedStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Estado de milestone inválido.' });
  }

  try {
    const contract = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);
    if (contract.rows.length === 0) {
      return res.status(404).json({ message: 'Contrato não encontrado.' });
    }
    const c = contract.rows[0];
    if (c.client_id !== userId && c.freelancer_id !== userId) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    let milestones = c.milestones || [];
    if (milestone_index < 0 || milestone_index >= milestones.length) {
      return res.status(400).json({ message: 'Milestone inválido.' });
    }

    milestones[milestone_index].status = status;
    milestones[milestone_index].updated_at = new Date().toISOString();

    await pool.query(
      'UPDATE contracts SET milestones = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(milestones), id]
    );

    res.json({ message: 'Milestone actualizado.', milestones });
  } catch (err) {
    console.error('Erro ao actualizar milestone:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { createContract, getMyContracts, getContract, signContract, updateMilestone };
