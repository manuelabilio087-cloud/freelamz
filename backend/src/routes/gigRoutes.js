const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createGig, getGigs, getFeaturedGigs, getGigById } = require('../controllers/gigController');

router.get('/featured', getFeaturedGigs);
router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/', authMiddleware, createGig);

module.exports = router;
