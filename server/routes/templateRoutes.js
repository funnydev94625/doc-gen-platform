const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/templates
// @desc    Get all templates
// @access  Public
router.get('/', templateController.getAllTemplates);

// @route   GET api/templates/:id
// @desc    Get template by ID
// @access  Public
router.get('/:id', templateController.getTemplateById);

// @route   POST api/templates
// @desc    Create a new template
// @access  Private (Admin only)
router.post('/', [auth, admin], templateController.createTemplate);

// @route   PUT api/templates/:id
// @desc    Update template
// @access  Private (Admin only)
router.put('/:id', [auth, admin], templateController.updateTemplate);

// @route   DELETE api/templates/:id
// @desc    Delete template
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], templateController.deleteTemplate);

module.exports = router;