const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createGig, getGigs, getGigById } = require('../controllers/gigController');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');

router.post('/gigs', authMiddleware, createGig);
router.get('/gigs', getGigs);
router.get('/gigs/:id', getGigById);

router.post('/orders', authMiddleware, createOrder);
router.get('/orders', authMiddleware, getOrders);
router.get('/orders/:id', authMiddleware, getOrderById);
router.put('/orders/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;