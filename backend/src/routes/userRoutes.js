const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getFreelancers, getAllUsers, deleteUser, verifyFreelancer, sendNewsletter, getFreelancerStats, getFreelancerById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/freelancers', getFreelancers);
router.get('/all', authMiddleware, adminMiddleware, getAllUsers);
router.get('/stats', authMiddleware, getFreelancerStats);
router.get('/freelancer/:id', getFreelancerById);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);
router.put('/verify/:id', authMiddleware, adminMiddleware, verifyFreelancer);
router.post('/newsletter', authMiddleware, adminMiddleware, sendNewsletter);

module.exports = router;