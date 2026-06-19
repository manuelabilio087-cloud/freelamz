const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, sendProposal } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.post('/', authMiddleware, createProject);
router.get('/:id', getProjectById);
router.post('/:id/proposals', authMiddleware, sendProposal);

module.exports = router;
