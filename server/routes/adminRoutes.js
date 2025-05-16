const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', [auth, admin], adminController.getAllUsers);

// @route   GET api/admin/analytics
// @desc    Get platform usage statistics
// @access  Private (Admin only)
router.get('/analytics', [auth, admin], adminController.getAnalytics);

// @route   POST api/admin/settings
// @desc    Update platform-level settings
// @access  Private (Admin only)
router.post('/settings', [auth, admin], adminController.updateSettings);

module.exports = router; 