const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const policyController = require('../controllers/policyController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Template = require('../models/Template');

// Set up multer storage
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

// @route   GET api/policies
// @desc    Get all policies
// @access  Public
router.get("/", policyController.getAllPolicies);

// @route   GET api/policies/:id
// @desc    Get policy by ID
// @access  Public
router.get("/:id", policyController.getPolicyById);

// @route   POST api/policies
// @desc    Create a new policy
// @access  Private (Admin only)
router.post("/", [auth, admin], policyController.createPolicy);

// @route   PUT api/policies/:id
// @desc    Update policy
// @access  Private (Admin only)
router.put("/:id", [auth, admin], policyController.updatePolicy);

// @route   DELETE api/policies/:id
// @desc    Delete policy
// @access  Private (Admin only)
router.delete("/:id", [auth, admin], policyController.deletePolicy);

// POST /api/policies/upload-docx
router.post("/upload-docx", upload.single("file"), async (req, res) => {
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


