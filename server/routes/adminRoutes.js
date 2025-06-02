const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const policyRoutes = require('./policyRoutes');
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


router.post('/template', [auth, admin], adminController.createTemplate);

router.post('/template/element', [auth, admin], adminController.createElement);

router.put('/template/element', [auth, admin], adminController.updateElements);

router.get('/template/element/:id', adminController.getTemplateElement);

router.get('/template/:id', adminController.getTemplate);

router.get('/template', adminController.getAllTemplates);

router.use('/policies', policyRoutes);

router.post('/section', [auth, admin], adminController.createSection);

router.get('/section/:id', adminController.getAllSections);

router.put('/section/:id', [auth, admin], adminController.updateSection);

router.delete('/section/:id', [auth, admin], adminController.deleteSection);


module.exports = router; 