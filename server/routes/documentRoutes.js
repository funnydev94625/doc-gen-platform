const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/auth');

// @route   POST api/documents
// @desc    Submit new response
// @access  Private
router.post('/', auth, documentController.submitResponse);

// @route   GET api/documents/:id
// @desc    Get response by ID
// @access  Private
router.get('/:id', auth, documentController.getResponseById);

// @route   PUT api/documents/:id
// @desc    Update response
// @access  Private
router.put('/:id', auth, documentController.updateResponse);

// @route   DELETE api/documents/:id
// @desc    Delete response
// @access  Private
router.delete('/:id', auth, documentController.deleteResponse);

// @route   GET api/documents/user/:id
// @desc    Get all user's documents
// @access  Private
router.get('/user/:id', auth, documentController.getUserDocuments);

// @route   POST api/documents/render
// @desc    Render document from answers
// @access  Private
router.post('/render', auth, documentController.renderDocument);

// @route   POST api/documents/pdf
// @desc    Convert rendered document to PDF
// @access  Private
router.post('/pdf', auth, documentController.generatePDF);

// @route   GET api/documents/embed/:id
// @desc    Get HTML embed code
// @access  Private
router.get('/embed/:id', auth, documentController.getEmbedCode);

module.exports = router;