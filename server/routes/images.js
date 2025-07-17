const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { uploadMultiple, simpleFileUpload } = require('../middlewares/uploadMiddleware');

// Extract text from images using OCR
router.post('/extract-text', simpleFileUpload, imageController.extractTextFromImages);

// Generate question set from images
router.post('/predict-questions', simpleFileUpload, imageController.predictQuestionsFromImages);

// Test image processing
router.post('/test', simpleFileUpload, imageController.testImageProcessing);

// Base64-based image processing
router.post('/predict-questions-base64', imageController.predictQuestionsFromImagesBase64);
router.post('/test-base64', imageController.testImageBase64);

module.exports = router; 