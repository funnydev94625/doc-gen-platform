const path = require("path");
const fs = require("fs");
const Template = require("../models/Template");
const Blank = require("../models/Blank");
const Section = require("../models/Section");
const mammoth = require("mammoth");
const User = require("../models/User");
const Policy = require("../models/Policy");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

async function extractBlanksFromDocx(filePath) {
  const { value } = await mammoth.extractRawText({ path: filePath });
  const matches = [...value.matchAll(/\$\{([^\}]+)\}/g)];
  // Use a Set to filter out duplicates
  const uniqueWords = Array.from(new Set(matches.map((m) => m[1])));
  return uniqueWords;
}

exports.create_template = async (req, res) => {
  try {
    const { title, description } = req.body;
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No docx file uploaded" });
    }
    const template = new Template({
      title,
      description,
      docx: req.file.filename, // Save the uploaded file's name
    });
    await template.save();

    // Extract blanks from docx and create Blank documents
    const filePath = path.join(__dirname, "../uploads/policies", template.docx);
    const blanks = await extractBlanksFromDocx(filePath);
    await Blank.insertMany(
      blanks.map((word) => ({
        template_id: template._id,
        placeholder: word,
        question: ""
      }))
    );

    res.json(template);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.update_template = async (req, res) => {
  try {
    const { id, title, description } = req.body;
    const update = { title, description };

    if (req.file) {
      update.docx = req.file.filename;
    }

    const template = await Template.findByIdAndUpdate(id, update, {
      new: true,
    });

    // Remove all blanks for this template
    await Blank.deleteMany({ template_id: template._id });

    // Extract new blanks from docx and create Blank documents
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "../uploads/policies",
        req.file.filename
      );
      const blanks = await extractBlanksFromDocx(filePath);
      await Blank.insertMany(
        blanks.map((word) => ({
          template_id: template._id,
          placeholder: word,
        }))
      );
    }

    res.json(template);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.delete_template = async (req, res) => {
  try {
    const { id } = req.params; // or req.params.id if using URL param

    // Delete all blanks related to this template
    await Blank.deleteMany({ template_id: id });

    // Delete the template itself
    await Template.findByIdAndDelete(id);

    res.json({ message: "Template and related blanks deleted." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.get_blanks = async (req, res) => {
  try {
    const { template_id } = req.params;
    const blanks = await Blank.find({ template_id });
    res.json(blanks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.update_blank = async (req, res) => {
  try {
    const { id } = req.params;
    const { ans_res, section_id, question } = req.body;
    console.log(req.body)

    // Build update object dynamically
    const update = {};
    if (ans_res !== undefined) update.ans_res = ans_res;
    if (section_id !== undefined) update.section_id = section_id;
    if (question !== undefined) update.question = question;
    update.updated_at = Date.now();

    let blank;
    console.log(update)
    if (ans_res === undefined && section_id === undefined) {
      // Remove ans_res field if both are undefined
      blank = await Blank.findByIdAndUpdate(
        id,
        { $unset: { ans_res: "" }, ...update },
        { new: true }
      );
    } else {
      blank = await Blank.findByIdAndUpdate(id, update, { new: true });
    }
    res.json(blank);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.create_section = async (req, res) => {
  const { template_id } = req.params;
  const { title } = req.body;
  try {
    const section = new Section({
      title,
      template_id,
    });
    await section.save();
    res.json(section);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.get_sections = async (req, res) => {
  const { template_id } = req.params;
  try {
    const sections = await Section.find({ template_id, isDel: false });
    res.json(sections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.update_section = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const section = await Section.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );
    res.json(section);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.delete_section = async (req, res) => {
  const { id } = req.params;
  try {
    // Mark section as deleted
    await Section.findByIdAndUpdate(id, { isDel: true });

    // Remove section_id from all blanks that reference this section
    await Blank.updateMany({ section_id: id }, { $unset: { section_id: "" } });

    res.json({
      message: "Section deleted and section_id removed from related blanks.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Change a user's status.
 * @param {string} userId - The user's ID.
 * @param {number} status - The new status (0: pending, 1: active, 2: suspended, etc).
 */
exports.changeUserState = async (req, res) => {
  try {
    const { userId, status } = req.body;
    if (!userId || typeof status !== "number") {
      return res.status(400).json({ msg: "userId and status are required." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    res.json({ msg: "User status updated.", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Populate policies for each user
    const users = await User.find().lean();

    // Get all policies grouped by user_id
    const allPolicies = await Policy.find().lean();
    const policiesByUser = {};
    allPolicies.forEach(policy => {
      const uid = String(policy.user_id);
      if (!policiesByUser[uid]) policiesByUser[uid] = [];
      policiesByUser[uid].push(policy);
    });

    // Attach policies to each user
    const usersWithPolicies = users.map(user => ({
      ...user,
      policies: policiesByUser[String(user._id)] || []
    }));

    res.json(usersWithPolicies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ msg: "userId is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Generate a new random password (same style as register)
    const newPassword = uuidv4().replace(/-/g, '').slice(0, 10);

    // Hash password (same as in register)
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Send notification email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Your password has been reset",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f6f9fc; padding: 32px;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px;">
            <h2 style="color: #2563eb; margin-bottom: 16px;">Password Reset</h2>
            <p style="color: #333; font-size: 16px; margin-bottom: 24px;">
              Your password has been reset by an administrator.<br>
              Your new password is:
            </p>
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 24px;">${newPassword}</div>
            <p style="color: #888; font-size: 13px; margin-top: 32px;">
              Please log in and change your password immediately.
            </p>
          </div>
        </div>
      `,
    });

    res.json({ msg: "Password reset successfully and emailed to user." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
