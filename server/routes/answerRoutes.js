const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const auth = require('../middleware/auth');

// // Get a single answer
// router.get('/policy/:policy_id/element/:element_id', auth, answerController.getAnswer);

// // Create or Update answers
// router.post('/policy/:policy_id', auth, answerController.createOrUpdateAnswers);

// // Delete a single answer
// router.delete('/policy/:policy_id/element/:element_id', auth, answerController.deleteAnswer);

// // Delete all answers for a policy
// router.delete('/policy/:policy_id', auth, answerController.deleteAllAnswers);


// Create Common (single or multiple)
router.post('/common', answerController.createCommon);

router.get('/common', auth, answerController.getCommons);

// Update Common by ID
router.put('/common', answerController.updateCommon);

module.exports = router;