const express = require('express');
const router = express.Router();
const path = require('path');
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

// @route   POST api/templates/plain
// @desc    Create a new plain document from template
// @access  Private (Admin only) ?????????
router.post('/plain', templateController.createPlain);

router.get("/policy/:filename", (req, res) => {
    try {
        const filename = req.params.filename;
        console.log(filename)
        const filePath = path.join(__dirname, '../uploads/policies', filename);

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(404).json({
                    success: false,
                    msg: "File not found"
                });
            }
        });
    } catch (error) {
        console.error('Error serving file:', error);
        res.status(500).json({
            success: false,
            msg: "Error serving file",
            error: error.message
        });
    }
});

module.exports = router;
