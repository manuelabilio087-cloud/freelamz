const express = require('express');
const router = express.Router();
const { createProposal, getProposalsByProject, getMyProposals, updateProposalStatus } = require('../controllers/proposalController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createProposal);
router.get('/my', authMiddleware, getMyProposals);
router.get('/project/:projectId', authMiddleware, getProposalsByProject);
router.put('/:id', authMiddleware, updateProposalStatus);

module.exports = router;