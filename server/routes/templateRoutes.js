const express = require('express')
const router = express.Router()
const templateController = require('../controllers/templateController')
const auth = require('../middleware/auth')

// Get all templates
router.get('/', auth, templateController.getAllTemplates)

// Get a single template
router.get('/:id', auth, templateController.getTemplateById)

router.get('/preview/:id', auth, templateController.preview_template)

module.exports = router