const express = require('express');
const router = express.Router();
const { initiatePayment, getMyPayments, getFinancialSummary } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/initiate', authMiddleware, initiatePayment);
router.get('/my', authMiddleware, getMyPayments);
router.get('/summary', authMiddleware, getFinancialSummary);

module.exports = router;