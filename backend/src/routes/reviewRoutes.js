const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, reviewController.createReview);
router.get('/my', authMiddleware, reviewController.getMyReviews);
router.get('/freelancer/:freelancer_id', reviewController.getFreelancerReviews);

module.exports = router;