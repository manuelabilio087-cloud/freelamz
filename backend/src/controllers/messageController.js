const pool = require('../config/db');

const sendMessage = async (req, res) => {
  const { receiver_id, content } = req.body;

  try {
    const message = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (\, \, \) RETURNING *',
      [req.user.id, receiver_id, content]
    );

    res.status(201).json(message.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await pool.query(
      'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE (m.sender_id = \ AND m.receiver_id = \) OR (m.sender_id = \ AND m.receiver_id = \) ORDER BY m.created_at ASC',
      [req.user.id, req.params.userId]
    );

    res.json(messages.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await pool.query(
      'SELECT DISTINCT ON (u.id) u.id, u.name, u.avatar, m.content as last_message, m.created_at FROM messages m JOIN users u ON (CASE WHEN m.sender_id = \ THEN m.receiver_id ELSE m.sender_id END) = u.id WHERE m.sender_id = \ OR m.receiver_id = \ ORDER BY u.id, m.created_at DESC',
      [req.user.id]
    );

    res.json(conversations.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };
