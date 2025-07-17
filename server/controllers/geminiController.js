const pdfService = require('../services/pdfService');
const geminiApi = require('../services/geminiApi');

exports.predictQuestions = async (req, res) => {
  try {
    // Handle both req.files (array) and req.file (single)
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    console.log('Uploaded files:', files.map(f => ({ name: f.originalname, size: f.size })));

    // Extract text from all uploaded files
    const texts = [];
    for (const file of files) {
      try {
        // Only process PDF files
        if (file.mimetype === 'application/pdf') {
          const text = await pdfService.extractTextFromPDF(file.buffer);
          texts.push(text);
        } else {
          console.log(`Skipping non-PDF file: ${file.originalname}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        return res.status(400).json({ 
          message: `Failed to process file ${file.originalname}: ${error.message}` 
        });
      }
    }

    if (texts.length === 0) {
      return res.status(400).json({ message: 'No PDF files were successfully processed' });
    }

    // Analyze with Gemini
    const questions = await geminiApi.analyzeQuestions(texts.join(' '));
    
    // Create PDF with predicted questions
    const pdfBuffer = await pdfService.createPredictionPDF(questions);
    
    res.set({ 
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="predicted-questions.pdf"'
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Question Prediction Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// New base64-based approach for file upload
exports.predictQuestionsBase64 = async (req, res) => {
  try {
    const { files } = req.body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    console.log('Processing', files.length, 'files via base64');

    // Extract text from all uploaded files
    const texts = [];
    for (const file of files) {
      try {
        if (file.type === 'application/pdf' && file.data) {
          console.log(`Processing file: ${file.name}, data length: ${file.data.length}`);
          
          // Clean the base64 data (remove data URL prefix if present)
          let cleanData = file.data;
          if (cleanData.includes(',')) {
            cleanData = cleanData.split(',')[1];
          }
          
          // Decode base64 to buffer
          const buffer = Buffer.from(cleanData, 'base64');
          console.log(`Decoded buffer size: ${buffer.length} bytes`);
          
          const text = await pdfService.extractTextFromPDF(buffer);
          texts.push(text);
          console.log(`Successfully processed: ${file.name}`);
        } else {
          console.log(`Skipping non-PDF file: ${file.name}, type: ${file.type}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        return res.status(400).json({ 
          message: `Failed to process file ${file.name}: ${error.message}` 
        });
      }
    }

    if (texts.length === 0) {
      return res.status(400).json({ message: 'No PDF files were successfully processed' });
    }

    // Analyze with Gemini
    const questions = await geminiApi.analyzeQuestions(texts.join(' '));
    
    // Create PDF with predicted questions
    const pdfBuffer = await pdfService.createPredictionPDF(questions);
    
    res.set({ 
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="predicted-questions.pdf"'
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Question Prediction Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.chatWithAssistant = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
    
    const response = await geminiApi.chat(prompt, req.file);
    res.json({ response });
  } catch (err) {
    console.error('Chat Assistant Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Test endpoint to check API key
exports.testGemini = async (req, res) => {
  try {
    const response = await geminiApi.chat('Hello, this is a test message.');
    res.json({ 
      success: true, 
      message: 'Gemini API is working correctly',
      response: response.substring(0, 100) + '...'
    });
  } catch (err) {
    console.error('Gemini Test Error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Test file upload endpoint
exports.testFileUpload = async (req, res) => {
  try {
    console.log('=== FILE UPLOAD TEST ===');
    console.log('Request headers:', req.headers);
    console.log('Request body keys:', Object.keys(req.body || {}));
    console.log('Files received:', req.files ? req.files.length : 0);
    console.log('File received:', req.file ? 1 : 0);
    
    if (req.files) {
      console.log('File details:', req.files.map(f => ({
        fieldname: f.fieldname,
        originalname: f.originalname,
        mimetype: f.mimetype,
        size: f.size
      })));
    }
    
    if (req.file) {
      console.log('Single file details:', {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    }
    
    res.json({ 
      success: true, 
      message: 'File upload test successful',
      filesCount: req.files ? req.files.length : 0,
      singleFile: req.file ? 1 : 0,
      headers: req.headers['content-type'],
      bodyKeys: Object.keys(req.body || {})
    });
  } catch (err) {
    console.error('File Upload Test Error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Simple test endpoint that accepts any file
exports.testSimpleUpload = async (req, res) => {
  try {
    console.log('=== SIMPLE UPLOAD TEST ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', Object.keys(req.body || {}));
    
    // Try to get files from different possible locations
    const files = req.files || req.file || [];
    const fileArray = Array.isArray(files) ? files : [files];
    
    console.log('Files found:', fileArray.length);
    
    res.json({
      success: true,
      message: 'Simple upload test completed',
      filesCount: fileArray.length,
      contentType: req.headers['content-type'],
      bodyType: typeof req.body
    });
  } catch (err) {
    console.error('Simple Upload Test Error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Test with a sample PDF (for debugging)
exports.testSamplePDF = async (req, res) => {
  try {
    // Create a simple PDF for testing
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);
        console.log('Created test PDF, size:', pdfBuffer.length, 'bytes');
        
        // Test PDF parsing
        const text = await pdfService.extractTextFromPDF(pdfBuffer);
        console.log('Extracted text length:', text.length);
        
        res.json({
          success: true,
          message: 'PDF processing is working correctly',
          pdfSize: pdfBuffer.length,
          textLength: text.length,
          textPreview: text.substring(0, 100)
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'PDF processing failed: ' + error.message
        });
      }
    });
    
    doc.fontSize(16).text('Test PDF Document', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('This is a test PDF document created for testing the PDF processing functionality.');
    doc.moveDown();
    doc.text('It contains sample text that should be extracted by the PDF parser.');
    doc.end();
    
  } catch (err) {
    console.error('Sample PDF Test Error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Test base64 PDF processing
exports.testBase64PDF = async (req, res) => {
  try {
    const { file } = req.body;
    
    if (!file || !file.data) {
      return res.status(400).json({ message: 'No file data provided' });
    }
    
    console.log('Testing base64 PDF processing');
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('Data length:', file.data.length);
    console.log('Data preview (first 100 chars):', file.data.substring(0, 100));
    
    // Clean the base64 data
    let cleanData = file.data;
    if (cleanData.includes(',')) {
      cleanData = cleanData.split(',')[1];
      console.log('Removed data URL prefix');
    }
    
    // Check if base64 is valid
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanData)) {
      return res.status(400).json({ 
        message: 'Invalid base64 data',
        dataPreview: cleanData.substring(0, 50)
      });
    }
    
    // Decode base64 to buffer
    const buffer = Buffer.from(cleanData, 'base64');
    console.log('Decoded buffer size:', buffer.length, 'bytes');
    
    // Check first 20 bytes
    const firstBytes = buffer.toString('hex', 0, 20);
    console.log('First 20 bytes (hex):', firstBytes);
    
    // Check PDF header
    const header = buffer.toString('ascii', 0, 8);
    console.log('PDF header:', header);
    
    if (!header.startsWith('%PDF')) {
      return res.status(400).json({ 
        message: 'Invalid PDF file (missing PDF header)',
        header: header,
        firstBytes: firstBytes,
        bufferSize: buffer.length
      });
    }
    
    // Try to extract text
    const text = await pdfService.extractTextFromPDF(buffer);
    
    res.json({
      success: true,
      message: 'PDF processing test successful',
      fileSize: buffer.length,
      textLength: text.length,
      textPreview: text.substring(0, 200) + '...'
    });
    
  } catch (err) {
    console.error('Base64 PDF Test Error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
}; 