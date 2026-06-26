const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getFreelancers, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/freelancers', getFreelancers);
router.get('/all', authMiddleware, getAllUsers);

module.exports = router;