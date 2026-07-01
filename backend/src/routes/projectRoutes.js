const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, sendProposal, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getProjects);
router.post('/', authMiddleware, createProject);
router.get('/:id', getProjectById);
router.post('/:id/proposals', authMiddleware, sendProposal);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProject);

module.exports = router;
