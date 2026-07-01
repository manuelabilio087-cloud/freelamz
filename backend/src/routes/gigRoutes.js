const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { createGig, getGigs, getFeaturedGigs, getGigById, getAllGigsAdmin, deleteGig } = require('../controllers/gigController');

router.get('/featured', getFeaturedGigs);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllGigsAdmin);
router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/', authMiddleware, createGig);
router.delete('/:id', authMiddleware, adminMiddleware, deleteGig);

module.exports = router;
