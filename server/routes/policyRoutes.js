const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const policyController = require("../controllers/policyController");
const answerController = require('../controllers/answerController');
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Template = require("../models/Template");

router.post("/", [auth], policyController.create_policy);

router.get("/", [auth], policyController.get_all_policies);

router.get("/:policy_id", [auth], policyController.get_one_policy);

router.put("/:policy_id", [auth], policyController.update_policy);

router.delete("/:policy_id", [auth], policyController.delete_policy);

router.put("/:policy_id/favorite", [auth], policyController.toggle_favorite);

router.get("/preview/:policy_id", [auth], policyController.preview_policy);

router.get('/common/:id', [auth], answerController.getCommons);

router.post('/common/create', [auth], answerController.createCommon)
    
router.put('/common/update', [auth], answerController.updateCommon)

module.exports = router;
