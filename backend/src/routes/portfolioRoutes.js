const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addPortfolioItem, getPortfolioByUser, deletePortfolioItem } = require('../controllers/portfolioController');

router.get('/user/:userId', getPortfolioByUser);
router.post('/', authMiddleware, addPortfolioItem);
router.delete('/:id', authMiddleware, deletePortfolioItem);

module.exports = router;
