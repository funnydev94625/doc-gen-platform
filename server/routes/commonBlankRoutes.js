const express = require('express');
const router = express.Router();
const commonBlankController = require('../controllers/commonBlankController');

// Create
router.post('/', commonBlankController.createCommonBlank);

// Read all
router.get('/', commonBlankController.getCommonBlanks);

// Read one
router.get('/:id', commonBlankController.getCommonBlankById);

// Update
router.put('/:id', commonBlankController.updateCommonBlank);

// Delete
router.delete('/:id', commonBlankController.deleteCommonBlank);

module.exports = router;