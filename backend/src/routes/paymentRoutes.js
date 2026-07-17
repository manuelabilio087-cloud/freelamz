const express = require('express');
const router = express.Router();
const { initiatePayment, getMyPayments, getFinancialSummary, getPendingPayouts, markPayoutsPaid } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/initiate', authMiddleware, initiatePayment);
router.get('/my', authMiddleware, getMyPayments);
router.get('/summary', authMiddleware, getFinancialSummary);
router.get('/payouts', authMiddleware, adminMiddleware, getPendingPayouts);
router.post('/payouts/:freelancerId/mark-paid', authMiddleware, adminMiddleware, markPayoutsPaid);

module.exports = router;
