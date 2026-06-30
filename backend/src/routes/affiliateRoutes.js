const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMyReferralCode } = require('../controllers/affiliateController');

router.use(authMiddleware);
router.get('/my-code', getMyReferralCode);

module.exports = router;
