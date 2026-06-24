const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createGig, getGigs, getGigById } = require('../controllers/gigController');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');

router.post('/gigs', verifyToken, createGig);
router.get('/gigs', getGigs);
router.get('/gigs/:id', getGigById);

router.post('/orders', verifyToken, createOrder);
router.get('/orders', verifyToken, getOrders);
router.get('/orders/:id', verifyToken, getOrderById);
router.put('/orders/:id/status', verifyToken, updateOrderStatus);

module.exports = router;