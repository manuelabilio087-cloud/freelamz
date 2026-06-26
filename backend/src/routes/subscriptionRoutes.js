const express = require('express');
const router = express.Router();
const { subscribePro, getMyPlan, getPlatformRevenue } = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/pro', authMiddleware, subscribePro);
router.get('/my-plan', authMiddleware, getMyPlan);
router.get('/revenue', authMiddleware, getPlatformRevenue);

module.exports = router;