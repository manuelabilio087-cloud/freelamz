const pool = require('../config/db');

const sendMessage = async (req, res) => {
  const { receiver_id, content } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content) 
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, receiver_id, content]
    );

    const messageWithSender = await pool.query(
      `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.id = $1`,
      [result.rows[0].id]
    );

    const message = messageWithSender.rows[0];

    // Emite via Socket.io em tempo real
    const io = req.app.get('io');
    if (io) {
      io.emit(`message:${receiver_id}`, message);
      io.emit(`notification:${receiver_id}`, {
        type: 'message',
        title: 'Nova mensagem!',
        body: `${message.sender_name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
        url: '/messages',
      });
    }

    res.status(201).json(message);
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at ASC`,
      [req.user.id, req.params.userId]
    );

    // Marca mensagens como lidas
    await pool.query(
      `UPDATE messages SET is_read = true 
       WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false`,
      [req.user.id, req.params.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar mensagens:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (other_user.id)
        other_user.id,
        other_user.name,
        other_user.avatar,
        m.content as last_message,
        m.created_at,
        COUNT(unread.id) as unread_count
       FROM messages m
       JOIN users other_user ON (
         CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
       ) = other_user.id
       LEFT JOIN messages unread ON unread.receiver_id = $1 
         AND unread.sender_id = other_user.id 
         AND unread.is_read = false
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       GROUP BY other_user.id, other_user.name, other_user.avatar, m.content, m.created_at
       ORDER BY other_user.id, m.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar conversas:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM messages 
       WHERE receiver_id = $1 AND is_read = false`,
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Erro ao buscar no lidas:', err);
    res.status(500).json({ message: 'Erro no servidor.', error: err.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations, getUnreadCount };
