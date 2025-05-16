const Template = require('../models/Template');

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ msg: 'Template not found' });
    }
    
    res.json(template);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Template not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create template (Admin only)
exports.createTemplate = async (req, res) => {
  try {
    const { title, description, documentType, questionSchema } = req.body;
    
    // Create new template
    const template = new Template({
      title,
      description,
      documentType,
      questionSchema,
      createdBy: req.user.id
    });
    
    await template.save();
    res.json(template);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update template (Admin only)
exports.updateTemplate = async (req, res) => {
  try {
    const { title, description, documentType, questionSchema } = req.body;
    
    // Find and update template
    let template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ msg: 'Template not found' });
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
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Template not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete template (Admin only)
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ msg: 'Template not found' });
    }
    
    await template.remove();
    res.json({ msg: 'Template removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Template not found' });
    }
    res.status(500).send('Server error');
  }
}; 