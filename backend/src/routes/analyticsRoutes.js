const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getGigAnalytics, getSellerAnalytics } = require('../controllers/analyticsController');

router.use(authMiddleware);
router.get('/seller', getSellerAnalytics);
router.get('/gig/:gigId', getGigAnalytics);

module.exports = router;
