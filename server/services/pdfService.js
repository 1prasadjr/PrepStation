const pdfParse = require('pdf-parse');
const PDFDocument = require('pdfkit');

exports.extractTextFromPDF = async (buffer) => {
  try {
    // Validate buffer
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('Invalid buffer provided');
    }
    
    if (buffer.length === 0) {
      throw new Error('Empty buffer provided');
    }
    
    // Check if it's actually a PDF by looking for PDF header
    const header = buffer.toString('ascii', 0, 8);
    if (!header.startsWith('%PDF')) {
      throw new Error('File is not a valid PDF (missing PDF header)');
    }
    
    console.log('PDF buffer size:', buffer.length, 'bytes');
    console.log('PDF header:', header);
    
    const data = await pdfParse(buffer);
    const text = data.text || 'No text content found in PDF';
    
    console.log('Extracted text length:', text.length, 'characters');
    return text;
  } catch (error) {
    console.error('PDF Parse Error Details:', {
      message: error.message,
      bufferSize: buffer ? buffer.length : 'undefined',
      bufferType: typeof buffer
    });
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

exports.createPredictionPDF = async (questions) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (error) => {
        reject(new Error(`PDF creation error: ${error.message}`));
      });
      
      doc.fontSize(20).text('PrepStation Predicted Questions', { align: 'center' });
      doc.moveDown();
      
      if (Array.isArray(questions)) {
        questions.forEach((q, i) => {
          if (q && q.trim()) {
            doc.fontSize(14).text(`${i + 1}. ${q}`);
            doc.moveDown(0.5);
          }
        });
      } else {
        // If questions is a string, split it into lines
        const questionLines = questions.split('\n').filter(line => line.trim());
        questionLines.forEach((q, i) => {
          doc.fontSize(14).text(`${i + 1}. ${q}`);
          doc.moveDown(0.5);
        });
      }
      
      doc.end();
    } catch (error) {
      reject(new Error(`PDF creation failed: ${error.message}`));
    }
  });
}; 