const db = require('../config/db');

const createProject = (req, res) => {
  const { title, description, budget, category } = req.body;

  db.run(
    'INSERT INTO projects (title, description, budget, category, client_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, budget, category, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      db.get(
        'SELECT p.*, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id WHERE p.id = ?',
        [this.lastID],
        (err, project) => {
          if (err) {
            return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
          }
          res.status(201).json(project);
        }
      );
    }
  );
};

const getProjects = (req, res) => {
  db.all(
    'SELECT p.*, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id ORDER BY p.created_at DESC',
    [],
    (err, projects) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      res.json(projects);
    }
  );
};

const getProjectById = (req, res) => {
  db.get(
    'SELECT p.*, u.name as client_name FROM projects p JOIN users u ON p.client_id = u.id WHERE p.id = ?',
    [req.params.id],
    (err, project) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      if (!project) {
        return res.status(404).json({ message: 'Projecto nao encontrado.' });
      }
      res.json(project);
    }
  );
};

const sendProposal = (req, res) => {
  const { cover_letter, price } = req.body;

  db.run(
    'INSERT INTO proposals (project_id, freelancer_id, cover_letter, price) VALUES (?, ?, ?, ?)',
    [req.params.id, req.user.id, cover_letter, price],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      db.get(
        'SELECT * FROM proposals WHERE id = ?',
        [this.lastID],
        (err, proposal) => {
          if (err) {
            return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
          }
          res.status(201).json(proposal);
        }
      );
    }
  );
};

module.exports = { createProject, getProjects, getProjectById, sendProposal };
