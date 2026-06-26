const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations, getUnreadCount } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, sendMessage);
router.get('/conversations', authMiddleware, getConversations);
router.get('/unread/count', authMiddleware, getUnreadCount);
router.get('/:userId', authMiddleware, getMessages);

module.exports = router;