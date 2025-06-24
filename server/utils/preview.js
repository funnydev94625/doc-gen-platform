const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const libre = require("libreoffice-convert");
const { createReport } = require("docx-templates");

const outputDir = path.resolve(__dirname, "../previews");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

/**
 * Generate a DOCX and PDF preview with replacements.
 * @param {string} fileUrl - Path to the DOCX template file.
 * @param {object} Replaces - Replacement data for docx-templates.
 * @param {string} id - Unique identifier for output files.
 * @returns {Promise<{docxPath: string, pdfPath: string}>}
 */
async function previewDoc(fileUrl, Replaces, id) {
  try {
    console.log(fileUrl, Replaces, id, "````````````````````");
    // Use async read
    const template = await fsp.readFile(fileUrl);

    const buffer = await createReport({
      template,
      data: Replaces,
      cmdDelimiter: ["${", "}"],
      noSandbox: true,
    });

    const docxPath = path.join(outputDir, `preview_${id}.docx`);
    const pdfPath = path.join(outputDir, `preview_${id}.pdf`);

    // Write DOCX asynchronously
    // await fsp.writeFile(docxPath, buffer);

    // Convert DOCX to PDF using libreoffice-convert
    try {
      // Use the buffer directly instead of reading again
      const pdfBuf = await new Promise((resolve, reject) => {
        libre.convert(buffer, ".pdf", undefined, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      fs.writeFileSync(pdfPath, pdfBuf);
      // Remove the edited docx after converting to pdf
      // fs.unlinkSync(docxPath);
    } catch (err) {
      console.error("Conversion error:", err);
      if (err.message && err.message.includes("soffice binary")) {
        console.error(
          "\nSOLUTION: Please install LibreOffice and ensure it's in your PATH"
        );
        console.error("Download from: https://www.libreoffice.org/");
      }
      throw err;
    }

    return { docxPath: null, pdfPath };
  } catch (error) {
    console.error("Error in previewDoc:", error);
    throw error;
  }
}

module.exports = previewDoc;
