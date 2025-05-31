const Template = require("../models/Template");
const Plain = require("../models/Plain");
const Input = require("../models/Input");
const Select = require("../models/Select");

const inputPattern = /\/\/\/([a-zA-Z]+)\\\\\\/g;
const replacePattern = /\/\/\/|\\\\\\/g;

const selectPattern = /\[\[\[([^\]]+)\]\]\]/g;
const selectReplacePattern = /\[\[\[|\]\]\]/g;

const createInput = async (content, plain_id) => {
  try {
    // Extract unique matches from content
    const matches = [...content.matchAll(inputPattern)]
      .map((match) => match[0])
      .filter((value, index, self) => self.indexOf(value) === index);

    // Create Input documents for each match
    const inputPromises = matches.map(async (match) => {
      const value = match.replace(replacePattern, "");

      // Check if input with this value already exists for this plain_id
      const existingInput = await Input.findOne({ plain_id, value });

      if (existingInput) {
        return existingInput; // Return existing input if found
      }

      // Create new input if not found
      const input =
        value !== "date"
          ? new Input({
              plain_id,
              value,
              type: 0,
            })
          : new Input({
              plain_id,
              date: new Date(),
              type: 1,
            });
      return input.save();
    });

    // Wait for all inputs to be saved
    await Promise.all(inputPromises);

    return matches;
  } catch (error) {
    console.error("Error creating inputs:", error);
    throw error;
  }
};

const createSelect = async (content, plain_id) => {
  try {
    // Extract unique matches from content
    const matches = [...content.matchAll(selectPattern)]
      .map((match) => match[0])
      .filter((value, index, self) => self.indexOf(value) === index);

    // Create Select documents for each match
    const selectPromises = matches.map(async (match) => {
      const valueString = match.replace(selectReplacePattern, "");
      // Split by pipe and trim whitespace
      const valueArray = valueString.split("|").map((item) => item.trim());

      // Check if select with these values already exists for this plain_id
      // We need to compare arrays, which is tricky in MongoDB
      // For simplicity, we'll convert the array to a string for comparison
      const valueStr = valueArray.join("|");
      const existingSelects = await Select.find({ plain_id });
      // Find a select with matching values
      const existingSelect = existingSelects.find(
        (select) => select.value.join("|") === valueStr
      );

      if (existingSelect) {
        return existingSelect; // Return existing select if found
      }

      // Create new select if not found
      const select = new Select({
        plain_id,
        value: valueArray,
        type: 1,
      });
      return select.save();
    });

    // Wait for all selects to be saved
    await Promise.all(selectPromises);

    return matches;
  } catch (error) {
    console.error("Error creating selects:", error);
    throw error;
  }
};

const example =
  "This Policy applies to all ///Company\\\\\\ employees, directors, and officers; any other individual or organization performing work for ///Company\\\\\\, including those employed by third parties, (collectively known as “Users”), all data and ///systems\\\\\\, including those employed by third parties, (collectively known as “Assets”); and business processes [[[used|not used]]] by or supporting ///Company\\\\\\. ";

exports.createPlain = async (req, res) => {
  try {
    const { parent_id, type, content, cells, after, prev } = req.body;

    // Create new plain document based on type
    const plain = new Plain({
      parent_id,
      type: type || 0, // Default to 0 (plain text) if not specified
      after,
      prev,
    });

    // Add content or cells based on type
    if (type === 0 || !type) {
      // Plain text type
      if (!content) {
        return res
          .status(400)
          .json({ msg: "Content is required for plain text type" });
      }
      plain.content = content;
    } else if (type === 1) {
      // Table type
      if (!cells || !Array.isArray(cells)) {
        return res
          .status(400)
          .json({ msg: "Cells array is required for table type" });
      }
      plain.cells = cells;
    }

    // Save plain document
    const savedPlain = await plain.save();

    // For plain text type, extract inputs and selects from content
    let inputs = [];
    let selects = [];

    if (type === 0 || !type) {
      [inputs, selects] = await Promise.all([
        createInput(content, savedPlain._id),
        createSelect(content, savedPlain._id),
      ]);
    }

    // Return the saved plain document along with extracted inputs and selects
    res.json({
      plain: savedPlain,
      inputs,
      selects,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ msg: "Template not found" });
    }

    res.json(template);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Template not found" });
    }
    res.status(500).send("Server error");
  }
};

// Create template (Admin only)
exports.createTemplate = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log(req.user)

    // Create new template
    const template = new Template({
      title,
      description,
      createdBy: req.user.id,
    });

    await template.save();
    res.json(template);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update template (Admin only)
exports.updateTemplate = async (req, res) => {
  try {
    const { title, description, documentType, questionSchema } = req.body;

    // Find and update template
    let template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ msg: "Template not found" });
    }

    // Update fields
    if (title) template.title = title;
    if (description) template.description = description;
    if (documentType) template.documentType = documentType;
    if (questionSchema) template.questionSchema = questionSchema;

    await template.save();
    res.json(template);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Template not found" });
    }
    res.status(500).send("Server error");
  }
};

// Delete template (Admin only)
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ msg: "Template not found" });
    }

    await template.remove();
    res.json({ msg: "Template removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Template not found" });
    }
    res.status(500).send("Server error");
  }
};
