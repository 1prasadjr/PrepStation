const express = require('express');
const router = express.Router();
const multer = require('multer');
const Paper = require('../models/Paper');
const path = require('path');
const fs = require('fs');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload a new question paper
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, stream, branch, year } = req.body;
    const fileName = req.file.filename;
    const paper = new Paper({ title, stream, branch, year, fileName });
    await paper.save();
    res.status(201).json({ message: 'Paper uploaded successfully', paper });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all papers (with optional filters)
router.get('/', async (req, res) => {
  const { stream, branch, year } = req.query;
  const query = {};
  if (stream) query.stream = stream;
  if (branch) query.branch = branch;
  if (year) query.year = year;
  const papers = await Paper.find(query);
  res.json(papers);
});

// Download a paper
router.get('/:id/download', async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    const filePath = path.join('uploads', paper.fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }
    res.download(filePath);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 