const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addFavorite, removeFavorite, getMyFavorites } = require('../controllers/favoriteController');

router.use(authMiddleware);
router.post('/', addFavorite);
router.delete('/', removeFavorite);
router.get('/', getMyFavorites);

module.exports = router;
