const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Template = require('../models/Template');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, "../uploads/policies");
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Save as: policy-<timestamp>.docx
      const ext = path.extname(file.originalname);
      cb(null, `policy-${Date.now()}${ext}`);
    },
  });
  const upload = multer({ storage });

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


router.post('/section', [auth, admin], adminController.createSection);

router.get('/section/:id', adminController.getAllSections);

router.put('/section/:id', [auth, admin], adminController.updateSection);

router.delete('/section/:id', [auth, admin], adminController.deleteSection);

router.post("/policies/upload-docx", upload.single("file"), async (req, res) => {
    try {
      const { template_id } = req.body;
      
      if (!template_id) {
        return res.status(400).json({ msg: "Template ID is required" });
      }
  
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }
  
      const template = await Template.findById(template_id);
      if (!template) {
        return res.status(404).json({ msg: "Template not found" });
      }
  
      // Delete previous file if it exists
      if (template.docx && template.docx.length > 0) {
        const prevFilePath = path.join(__dirname, "../uploads/policies", template.docx);
        try {
          fs.unlinkSync(prevFilePath);
        } catch (err) {
          console.error('Error deleting previous file:', err);
          // Continue with the upload even if deletion fails
        }
      }
  
      // Update template with new docx filename
      template.docx = req.file.filename;
      await template.save();
  
      res.json({
        success: true,
        msg: "File uploaded successfully",
        data: {
          filename: req.file.filename,
          path: req.file.path,
          templateId: template._id
        }
      });
  
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        success: false,
        msg: "Error uploading file",
        error: error.message 
      });
    }
  });
  
module.exports = router; 