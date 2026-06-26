const express = require('express');
const router = express.Router();
const { createContract, getMyContracts, getContract, signContract, updateMilestone } = require('../controllers/contractController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createContract);
router.get('/my', authMiddleware, getMyContracts);
router.get('/:id', authMiddleware, getContract);
router.put('/:id/sign', authMiddleware, signContract);
router.put('/:id/milestone', authMiddleware, updateMilestone);

module.exports = router;