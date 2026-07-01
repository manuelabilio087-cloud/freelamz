const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { createOrder, getOrders, getOrderById, updateOrderStatus, deliverOrder, requestRevision, acceptDelivery, getAllOrdersAdmin } = require('../controllers/orderController');

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/admin/all', adminMiddleware, getAllOrdersAdmin);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.post('/:id/deliver', deliverOrder);
router.post('/:id/request-revision', requestRevision);
router.post('/:id/accept', acceptDelivery);

module.exports = router;
