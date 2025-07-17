const Tesseract = require('tesseract.js');

exports.extractTextFromImage = async (imageBuffer) => {
  try {
    console.log('Starting OCR processing...');
    console.log('Image buffer size:', imageBuffer.length, 'bytes');
    
    const result = await Tesseract.recognize(
      imageBuffer,
      'eng', // English language
      {
        logger: m => console.log('OCR Progress:', m.progress * 100, '%')
      }
    );
    
    const text = result.data.text;
    console.log('OCR completed. Extracted text length:', text.length, 'characters');
    console.log('Text preview:', text.substring(0, 200) + '...');
    
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error(`Failed to extract text from image: ${error.message}`);
  }
};

exports.extractTextFromMultipleImages = async (imageBuffers) => {
  try {
    console.log('Processing', imageBuffers.length, 'images...');
    
    const texts = [];
    for (let i = 0; i < imageBuffers.length; i++) {
      console.log(`Processing image ${i + 1}/${imageBuffers.length}`);
      const text = await exports.extractTextFromImage(imageBuffers[i]);
      texts.push(text);
    }
    
    return texts;
  } catch (error) {
    console.error('Multiple Image OCR Error:', error);
    throw new Error(`Failed to process images: ${error.message}`);
  }
}; 