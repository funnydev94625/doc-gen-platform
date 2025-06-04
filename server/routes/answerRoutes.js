const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const auth = require('../middleware/auth');

// Get all answers for a policy
router.get('/policy/:policy_id', auth, answerController.getAnswers);

// Get a single answer
router.get('/policy/:policy_id/element/:element_id', auth, answerController.getAnswer);

// Create or Update answers
router.post('/policy/:policy_id', auth, answerController.createOrUpdateAnswers);

// Delete a single answer
router.delete('/policy/:policy_id/element/:element_id', auth, answerController.deleteAnswer);

// Delete all answers for a policy
router.delete('/policy/:policy_id', auth, answerController.deleteAllAnswers);

module.exports = router; 