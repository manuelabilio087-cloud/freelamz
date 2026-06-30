const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createOrder, getOrders, getOrderById, updateOrderStatus, deliverOrder, requestRevision, acceptDelivery } = require('../controllers/orderController');

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.post('/:id/deliver', deliverOrder);
router.post('/:id/request-revision', requestRevision);
router.post('/:id/accept', acceptDelivery);

module.exports = router;
