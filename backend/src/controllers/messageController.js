const db = require('../config/db');

const sendMessage = (req, res) => {
  const { receiver_id, content } = req.body;

  db.run(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [req.user.id, receiver_id, content],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      db.get(
        'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = ?',
        [this.lastID],
        (err, message) => {
          if (err) {
            return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
          }
          res.status(201).json(message);
        }
      );
    }
  );
};

const getMessages = (req, res) => {
  db.all(
    'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?) ORDER BY m.created_at ASC',
    [req.user.id, req.params.userId, req.params.userId, req.user.id],
    (err, messages) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      res.json(messages);
    }
  );
};

const getConversations = (req, res) => {
  db.all(
    'SELECT u.id, u.name, u.avatar, m.content as last_message, m.created_at FROM messages m JOIN users u ON (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) = u.id WHERE m.sender_id = ? OR m.receiver_id = ? GROUP BY u.id ORDER BY m.created_at DESC',
    [req.user.id, req.user.id, req.user.id],
    (err, conversations) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor.', error: err.message });
      }
      res.json(conversations);
    }
  );
};

module.exports = { sendMessage, getMessages, getConversations };
