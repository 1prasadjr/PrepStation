const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');
const { uploadMultiple, uploadSingle, uploadFlexible, handleMulterError, simpleFileUpload } = require('../middlewares/uploadMiddleware');

// Use simple file upload middleware
router.post('/predict', simpleFileUpload, geminiController.predictQuestions);
router.post('/predict-base64', geminiController.predictQuestionsBase64);
router.post('/predict-multer', uploadMultiple, geminiController.predictQuestions);
router.post('/assist', handleMulterError(uploadSingle), geminiController.chatWithAssistant);
router.post('/test-upload', simpleFileUpload, geminiController.testFileUpload);
router.post('/test-simple-upload', simpleFileUpload, geminiController.testSimpleUpload);
router.post('/test-base64', geminiController.testBase64PDF);
router.get('/test-sample-pdf', geminiController.testSamplePDF);
router.get('/test', geminiController.testGemini);

module.exports = router; 