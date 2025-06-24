const Template = require('../models/Template');
const Blank = require('../models/Blank');
const previewDoc = require('../utils/preview');

exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find()
        res.json(templates)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
}

exports.getTemplateById = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id)
        if (!template) {
            return res.status(404).json({ msg: 'Template not found' })
        }
        res.json(template)
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Template not found' })
        }
        res.status(500).send('Server error')
    }
}

/**
 * Generate and serve a PDF preview for a template,
 * with all blank questions replaced by "______".
 * @route GET /api/template/preview/:id
 */
exports.preview_template = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the template
    const template = await Template.findById(id);
    if (!template || !template.docx) {
      return res.status(404).json({ msg: 'Template or template file not found' });
    }

    // Find all blanks for this template
    const blanks = await Blank.find({
      $or: [
        { template_id: template._id },
        { template_id: { $exists: false } }
      ]
    });

    // Build replaces object: { question1: "______", ... }
    const replaces = {};
    blanks.forEach((blank, idx) => {
      // Use the question as the key, or you can use a specific variable name if needed
      replaces[blank.placeholder] = "______";
    });

    // Generate the preview PDF
    const { pdfPath } = await previewDoc('uploads/policies/' + template.docx, replaces, id);
    console.log('preview ended--------------')
    // Serve the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=preview.pdf');

    const fs = require('fs');
    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);

    // Optionally delete the PDF after streaming
    stream.on('close', () => {
      fs.unlink(pdfPath, () => {});
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
