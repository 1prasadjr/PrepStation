const imageService = require('../services/imageService');
const geminiApi = require('../services/geminiApi');
const pdfService = require('../services/pdfService');

exports.predictQuestionsFromImages = async (req, res) => {
  try {
    // Handle both req.files (array) and req.file (single)
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    console.log('Processing', files.length, 'images for question prediction');

    // Filter and process image files
    const imageFiles = files.filter(file => 
      file.mimetype && file.mimetype.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      return res.status(400).json({ message: 'No valid image files found' });
    }

    console.log('Valid image files:', imageFiles.length);

    // Extract text from all images using OCR
    const imageBuffers = imageFiles.map(file => file.buffer);
    const texts = await imageService.extractTextFromMultipleImages(imageBuffers);

    if (texts.length === 0) {
      return res.status(400).json({ message: 'No text could be extracted from images' });
    }

    // Combine all extracted text
    const combinedText = texts.join('\n\n');
    console.log('Total extracted text length:', combinedText.length, 'characters');

    // Analyze with Gemini AI to generate questions
    const questions = await geminiApi.analyzeQuestions(combinedText);
    
    // Create PDF with predicted questions
    const pdfBuffer = await pdfService.createPredictionPDF(questions);
    
    res.set({ 
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="predicted-questions-from-images.pdf"'
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Image Question Prediction Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.extractTextFromImages = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    console.log('Extracting text from', files.length, 'images');

    const imageFiles = files.filter(file => 
      file.mimetype && file.mimetype.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      return res.status(400).json({ message: 'No valid image files found' });
    }

    const imageBuffers = imageFiles.map(file => file.buffer);
    const texts = await imageService.extractTextFromMultipleImages(imageBuffers);

    res.json({
      success: true,
      message: 'Text extraction completed',
      imagesProcessed: imageFiles.length,
      extractedTexts: texts.map((text, index) => ({
        imageIndex: index + 1,
        textLength: text.length,
        textPreview: text.substring(0, 200) + '...',
        fullText: text
      }))
    });
  } catch (err) {
    console.error('Image Text Extraction Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Test endpoint for image processing
exports.testImageProcessing = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    console.log('Testing image processing with', files.length, 'files');

    const imageFiles = files.filter(file => 
      file.mimetype && file.mimetype.startsWith('image/')
    );

    res.json({
      success: true,
      message: 'Image processing test completed',
      totalFiles: files.length,
      imageFiles: imageFiles.length,
      fileDetails: imageFiles.map(file => ({
        name: file.originalname,
        type: file.mimetype,
        size: file.size
      }))
    });
  } catch (err) {
    console.error('Image Processing Test Error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Test base64 image processing
exports.testImageBase64 = async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image || !image.data) {
      return res.status(400).json({ message: 'No image data provided' });
    }
    
    console.log('Testing base64 image processing');
    console.log('Image name:', image.name);
    console.log('Image type:', image.type);
    console.log('Data length:', image.data.length);
    
    // Clean the base64 data
    let cleanData = image.data;
    if (cleanData.includes(',')) {
      cleanData = cleanData.split(',')[1];
    }
    
    // Decode base64 to buffer
    const buffer = Buffer.from(cleanData, 'base64');
    console.log('Decoded buffer size:', buffer.length, 'bytes');
    
    // Test OCR processing
    const text = await imageService.extractTextFromImage(buffer);
    
    res.json({
      success: true,
      message: 'Image OCR test successful',
      imageSize: buffer.length,
      textLength: text.length,
      textPreview: text.substring(0, 200) + '...',
      fullText: text
    });
    
  } catch (err) {
    console.error('Base64 Image Test Error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Base64-based image processing
exports.predictQuestionsFromImagesBase64 = async (req, res) => {
  try {
    const { images } = req.body;
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    console.log('Processing', images.length, 'images via base64');

    // Filter and process image files
    const imageFiles = images.filter(img => 
      img.type && img.type.startsWith('image/') && img.data
    );

    if (imageFiles.length === 0) {
      return res.status(400).json({ message: 'No valid image files found' });
    }

    console.log('Valid image files:', imageFiles.length);

    // Extract text from all images using OCR
    const imageBuffers = [];
    for (const file of imageFiles) {
      try {
        // Clean the base64 data
        let cleanData = file.data;
        if (cleanData.includes(',')) {
          cleanData = cleanData.split(',')[1];
        }
        
        // Decode base64 to buffer
        const buffer = Buffer.from(cleanData, 'base64');
        imageBuffers.push(buffer);
        console.log(`Processed image: ${file.name}, size: ${buffer.length} bytes`);
      } catch (error) {
        console.error(`Error processing image ${file.name}:`, error);
        return res.status(400).json({ 
          message: `Failed to process image ${file.name}: ${error.message}` 
        });
      }
    }

    if (imageBuffers.length === 0) {
      return res.status(400).json({ message: 'No images were successfully processed' });
    }

    // Extract text from images using OCR
    const texts = await imageService.extractTextFromMultipleImages(imageBuffers);

    if (texts.length === 0) {
      return res.status(400).json({ message: 'No text could be extracted from images' });
    }

    // Combine all extracted text
    const combinedText = texts.join('\n\n');
    console.log('Total extracted text length:', combinedText.length, 'characters');

    // Analyze with Gemini AI to generate questions
    const questions = await geminiApi.analyzeQuestions(combinedText);
    
    // Create PDF with predicted questions
    const pdfBuffer = await pdfService.createPredictionPDF(questions);
    
    res.set({ 
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="predicted-questions-from-images.pdf"'
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Image Question Prediction Error:', err);
    res.status(500).json({ message: err.message });
  }
}; 