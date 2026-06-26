const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getFreelancers, getAllUsers, deleteUser, verifyFreelancer, sendNewsletter, getFreelancerStats, getFreelancerById } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/freelancers', getFreelancers);
router.get('/all', authMiddleware, getAllUsers);
router.get('/stats', authMiddleware, getFreelancerStats);
router.get('/freelancer/:id', getFreelancerById);
router.delete('/:id', authMiddleware, deleteUser);
router.put('/verify/:id', authMiddleware, verifyFreelancer);
router.post('/newsletter', authMiddleware, sendNewsletter);

module.exports = router;