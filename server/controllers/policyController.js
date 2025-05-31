const Policy = require('../models/Policy');

// Get all policies
exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().sort({ createdAt: -1 });
    res.json(policies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get policy by ID
exports.getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({ msg: 'Policy not found' });
    }
    
    res.json(policy);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Policy not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create a new policy
exports.createPolicy = async (req, res) => {
  try {
    const { name, category, description, content, status } = req.body;
    console.log(req.user)
    // Create new policy
    const policy = new Policy({
      name,
      category,
      description,
      content,
      status,
      createdBy: req.user.id,
      lastUpdated: new Date(),
      downloads: 0
    });

    await policy.save();
    res.json(policy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update policy
exports.updatePolicy = async (req, res) => {
  try {
    const { name, category, description, content, status } = req.body;
    
    // Find policy by ID
    let policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({ msg: 'Policy not found' });
    }
    
    // Update fields
    policy.name = name || policy.name;
    policy.category = category || policy.category;
    policy.description = description || policy.description;
    policy.content = content || policy.content;
    policy.status = status || policy.status;
    policy.lastUpdated = new Date();
    
    await policy.save();
    res.json(policy);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Policy not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete policy
exports.deletePolicy = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({ msg: 'Policy not found' });
    }
    
    await policy.remove();
    res.json({ msg: 'Policy removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Policy not found' });
    }
    res.status(500).send('Server error');
  }
};