const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const policyController = require('../controllers/policyController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Template = require('../models/Template');


// Get all policies
router.get('/', auth, policyController.getPolicies);

// Get a single policy
router.get('/:id', auth, policyController.getPolicy);

// Get policy with all related data
router.get('/:id/details', auth, policyController.getPolicyWithDetails);

// Create a new policy
router.post('/', auth, policyController.createPolicy);

// Update a policy
router.put('/:id', auth, policyController.updatePolicy);

// Delete a policy
router.delete('/:id', auth, policyController.deletePolicy);

module.exports = router;


