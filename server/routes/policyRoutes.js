const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/policies
// @desc    Get all policies
// @access  Public
router.get('/', policyController.getAllPolicies);

// @route   GET api/policies/:id
// @desc    Get policy by ID
// @access  Public
router.get('/:id', policyController.getPolicyById);

// @route   POST api/policies
// @desc    Create a new policy
// @access  Private (Admin only)
router.post('/', [auth, admin], policyController.createPolicy);

// @route   PUT api/policies/:id
// @desc    Update policy
// @access  Private (Admin only)
router.put('/:id', [auth, admin], policyController.updatePolicy);

// @route   DELETE api/policies/:id
// @desc    Delete policy
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], policyController.deletePolicy);

module.exports = router;


