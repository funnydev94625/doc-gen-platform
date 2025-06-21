const Blank = require('../models/Blank');

// Create multiple Common Blanks from array
exports.createCommonBlank = async (req, res) => {
  try {
    // Accepts a single object or an array of objects
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // Ensure each blank has isCommon: true
    const blanksToCreate = data.map(item => ({
      ...item,
      isCommon: true,
    }));

    // Create all blanks
    const created = await Blank.insertMany(blanksToCreate);

    res.status(201).json(Array.isArray(req.body) ? created : created[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Common Blanks
exports.getCommonBlanks = async (req, res) => {
  try {
    const commonBlanks = await Blank.find({ isCommon: true });
    res.json(commonBlanks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Common Blank by ID
exports.getCommonBlankById = async (req, res) => {
  try {
    const blank = await Blank.findOne({ _id: req.params.id, isCommon: true });
    if (!blank) {
      return res.status(404).json({ error: 'Common Blank not found' });
    }
    res.json(blank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Common Blank by ID
exports.updateCommonBlank = async (req, res) => {
  try {
    const { name, ...rest } = req.body;
    const blank = await Blank.findOneAndUpdate(
      { _id: req.params.id, isCommon: true },
      { name, ...rest },
      { new: true }
    );
    if (!blank) {
      return res.status(404).json({ error: 'Common Blank not found' });
    }
    res.json(blank);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Common Blank by ID
exports.deleteCommonBlank = async (req, res) => {
  try {
    const blank = await Blank.findOneAndDelete({ _id: req.params.id, isCommon: true });
    if (!blank) {
      return res.status(404).json({ error: 'Common Blank not found' });
    }
    res.json({ message: 'Common Blank deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
