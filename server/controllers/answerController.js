const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const Common = require('../models/Common');
const Blank = require('../models/Blank');

// Create Common
exports.createCommon = async (req, res) => {
  try {
    const user_id = req.user.id;
    const data = req.body; // expects an array of objects

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Request body must be a non-empty array." });
    }

    // Attach user_id to every element
    const dataWithUser = data.map(item => ({
      ...item,
      user_id,
    }));

    // Find all existing commons for this user
    const existingCommons = await Common.find({ user_id });
    const existingMap = new Map(existingCommons.map(c => [String(c.blank_id), c]));

    const results = [];
    for (const item of dataWithUser) {
      const filter = { blank_id: item.blank_id, user_id };
      const update = { $set: { ...item, updated_at: new Date() } };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const updated = await Common.findOneAndUpdate(filter, update, options);
      results.push(updated);
    }

    res.status(201).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Common
exports.updateCommon = async (req, res) => {
  try {
    const dataArray = req.body; // expects an array of objects
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return res.status(400).json({ error: "Request body must be a non-empty array." });
    }

    const { user_id } = req.user.id;
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }
    // Remove all existing commons for this user_id
    await Common.deleteMany({ user_id });

    // Insert the new/updated commons
    const inserted = await Common.insertMany(dataArray);

    res.json(inserted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Common elements for the current user and add question field from Blank
exports.getCommons = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Use aggregate to join Common with Blank and add question field
    const commonsWithQuestion = await Common.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
      {
        $lookup: {
          from: 'blanks', // collection name in MongoDB
          localField: 'blank_id',
          foreignField: '_id',
          as: 'blankInfo'
        }
      },
      {
        $addFields: {
          question: { $arrayElemAt: ['$blankInfo.question', 0] }
        }
      },
      {
        $project: {
          blankInfo: 0 // remove the joined array
        }
      }
    ]);

    res.json(commonsWithQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
