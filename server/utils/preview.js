const fs = require('fs');
const path = require('path');
const { createReport } = require('docx-templates');
const libre = require('libreoffice-convert');

/**
 * Generate a DOCX and PDF preview with replacements.
 * @param {string} fileUrl - Path to the DOCX template file.
 * @param {object} Replaces - Replacement data for docx-templates.
 * @param {string} id - Unique identifier for output files.
 * @returns {Promise<{docxPath: string, pdfPath: string}>}
 */
async function previewDoc(fileUrl, Replaces, id) {
  try {
    console.log(fileUrl, Replaces, id);
    const template = fs.readFileSync(fileUrl);

    const buffer = await createReport({
      template,
      data: Replaces,
      cmdDelimiter: ['${', '}'],
      noSandbox: true
    });

    const outputDir = path.resolve(__dirname, '../previews');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const docxPath = path.join(outputDir, `preview_${id}.docx`);
    const pdfPath = path.join(outputDir, `preview_${id}.pdf`);

    fs.writeFileSync(docxPath, buffer);

    // Convert DOCX to PDF using libreoffice-convert
    try {
      const docx = fs.readFileSync(docxPath);
      const pdfBuf = await new Promise((resolve, reject) => {
        libre.convert(docx, '.pdf', undefined, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      fs.writeFileSync(pdfPath, pdfBuf);
      // Remove the edited docx after converting to pdf
      fs.unlinkSync(docxPath);
    } catch (err) {
      console.error('Conversion error:', err);
      if (err.message && err.message.includes('soffice binary')) {
        console.error('\nSOLUTION: Please install LibreOffice and ensure it\'s in your PATH');
        console.error('Download from: https://www.libreoffice.org/');
      }
      throw err;
    }

    return { docxPath: null, pdfPath };
  } catch (error) {
    console.error('Error in previewDoc:', error);
    throw error;
  }
}

module.exports = previewDoc;