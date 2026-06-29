const pool = require('../config/db');

const MAX_MESSAGE_LENGTH = 5000;

const sendMessage = async (req, res) => {
  const { receiver_id, content } = req.body;

  if (!receiver_id || !content || !content.trim()) {
    return res.status(400).json({ message: 'Destinatário e conteúdo são obrigatórios.' });
  }
  if (content.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ message: `Mensagem demasiado longa (máx. ${MAX_MESSAGE_LENGTH} caracteres).` });
  }
  // FIX: Impede enviar mensagem para si próprio
  if (String(receiver_id) === String(req.user.id)) {
    return res.status(400).json({ message: 'Não podes enviar mensagem para ti próprio.' });
  }

  try {
    // FIX: Verifica que o destinatário existe
    const receiverCheck = await pool.query('SELECT id FROM users WHERE id = $1', [receiver_id]);
    if (receiverCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Destinatário não encontrado.' });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, receiver_id, content.trim()]
    );

    const messageWithSender = await pool.query(
      `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
       FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id = $1`,
      [result.rows[0].id]
    );
    const message = messageWithSender.rows[0];

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
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getMessages = async (req, res) => {
  try {
    // FIX: Paginação para histórico de mensagens
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
       FROM messages m JOIN users u ON m.sender_id = u.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2)
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
      [req.user.id, req.params.userId, limit, offset]
    );

    // Marca como lidas em paralelo
    pool.query(
      `UPDATE messages SET is_read = true WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false`,
      [req.user.id, req.params.userId]
    ).catch(e => console.error('Erro ao marcar mensagens como lidas:', e));

    res.json(result.rows.reverse()); // Retorna em ordem cronológica
  } catch (err) {
    console.error('Erro ao buscar mensagens:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
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
        COUNT(unread.id) OVER (PARTITION BY other_user.id) as unread_count
       FROM messages m
       JOIN users other_user ON (
         CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
       ) = other_user.id
       LEFT JOIN messages unread ON unread.receiver_id = $1
         AND unread.sender_id = other_user.id
         AND unread.is_read = false
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY other_user.id, m.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar conversas:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = false`,
      [req.user.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Erro ao buscar não lidas:', err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { sendMessage, getMessages, getConversations, getUnreadCount };
