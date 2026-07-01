const express = require('express');
const router = express.Router();
const { subscribePro, getMyPlan, getPlatformRevenue } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/pro', authMiddleware, subscribePro);
router.get('/my-plan', authMiddleware, getMyPlan);
router.get('/revenue', authMiddleware, adminMiddleware, getPlatformRevenue);

module.exports = router;