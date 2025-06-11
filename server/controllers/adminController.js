const path = require("path");
const fs = require("fs");
const Template = require("../models/Template");
const Blank = require("../models/Blank");
const Section = require("../models/Section");
const mammoth = require("mammoth");

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
