const UserResponse = require('../models/UserResponse');
const Template = require('../models/Template');
const puppeteer = require('puppeteer');

// Submit new response (create document)
exports.submitResponse = async (req, res) => {
  try {
    const { templateId, answers } = req.body;
    
    // Create new response
    const response = new UserResponse({
      userId: req.user.id,
      templateId,
      answers
    });
    
    await response.save();
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get response by ID
exports.getResponseById = async (req, res) => {
  try {
    const response = await UserResponse.findById(req.params.id)
      .populate('templateId');
    
    if (!response) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    
    // Check if user owns this document or is admin
    if (response.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(response);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
};

// Update response
exports.updateResponse = async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Find and update response
    let response = await UserResponse.findById(req.params.id);
    
    if (!response) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    
    // Check if user owns this document or is admin
    if (response.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Update fields
    response.answers = answers;
    response.version = response.version + 1;
    response.updatedAt = Date.now();
    
    await response.save();
    res.json(response);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete response
exports.deleteResponse = async (req, res) => {
  try {
    const response = await UserResponse.findById(req.params.id);
    
    if (!response) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    
    // Check if user owns this document or is admin
    if (response.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await response.remove();
    res.json({ msg: 'Document removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Document not found' });
    }
    res.status(500).send('Server error');
  }
};

// Get all user's documents
exports.getUserDocuments = async (req, res) => {
  try {
    const responses = await UserResponse.find({ userId: req.params.id })
      .populate('templateId')
      .sort({ createdAt: -1 });
    
    res.json(responses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Render document as HTML
exports.renderDocument = async (req, res) => {
  try {
    const { responseId } = req.body;
    
    const response = await UserResponse.findById(responseId)
      .populate('templateId');
    
    if (!response) {
      return res.status(404).json({ msg: 'Document not found' });
    }
    
    // Check if user owns this document or is admin
    if (response.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Here you would normally generate the HTML document based on the template and answers
    // This is a simplified placeholder
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${response.templateId.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            .content { line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>${response.templateId.title}</h1>
          <div class="content">
            <p>Document generated on ${new Date().toLocaleDateString()}</p>
            <pre>${JSON.stringify(response.answers, null, 2)}</pre>
          </div>
        </body>
      </html>
    `;
    
    res.json({ html: htmlContent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Generate PDF from document
exports.generatePDF = async (req, res) => {
  try {
    const { html } = req.body;
    
    // Launch puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    
    await browser.close();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    
    // Send PDF
    res.send(pdf);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get embed code
exports.getEmbedCode = async (req, res) => {
  try {
    const documentId = req.params.id;
    
    // Generate embed code
    const embedCode = `<iframe src="${process.env.FRONTEND_URL}/documents/embed/${documentId}" width="100%" height="600px" frameborder="0"></iframe>`;
    
    res.json({ embedCode });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 