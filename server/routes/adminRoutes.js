const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Template = require("../models/Template");

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

router.post(
  "/template",
  [auth, admin, upload.single("docx")],
  adminController.create_template
);

router.put(
  "/template",
  [auth, admin, upload.single("docx")],
  adminController.update_template
);

router.delete(
  "/template/:id",
  [auth, admin],
  adminController.delete_template
)

router.get(
  '/blank/:template_id',
  [auth, admin],
  adminController.get_blanks
)

router.put(
  '/blank/:id',
  [auth, admin],
  adminController.update_blank
)

router.post(
  '/section/:template_id',
  [auth, admin],
  adminController.create_section
)

router.get(
  '/section/:template_id',
  [auth, admin],
  adminController.get_sections
)

router.put(
  '/section/:id',
  [auth, admin],
  adminController.update_section
)

router.delete(
  '/section/:id',
  [auth, admin],
  adminController.delete_section
)

module.exports = router;
