const User = require('../models/User');
const Template = require('../models/Template');
const UserResponse = require('../models/UserResponse');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get analytics data (Admin only)
exports.getAnalytics = async (req, res) => {
  try {
    // Count total users
    const userCount = await User.countDocuments();
    
    // Count total templates
    const templateCount = await Template.countDocuments();
    
    // Count total documents
    const documentCount = await UserResponse.countDocuments();
    
    // Get most used templates
    const mostUsedTemplates = await UserResponse.aggregate([
      { $group: { _id: '$templateId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Populate template details
    for (let i = 0; i < mostUsedTemplates.length; i++) {
      const template = await Template.findById(mostUsedTemplates[i]._id);
      mostUsedTemplates[i].template = template;
    }
    
    // Get document creation stats by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const documentsByDay = await UserResponse.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      userCount,
      templateCount,
      documentCount,
      mostUsedTemplates,
      documentsByDay
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update settings (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    // In a real app, you would store these settings in a database
    // This is a placeholder
    res.json({ msg: 'Settings updated successfully', settings });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};