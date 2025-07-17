const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  stream: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  fileName: { type: String, required: true }, // The filename stored on disk
  uploadedAt: { type: Date, default: Date.now },
});

const Paper = mongoose.model('Paper', paperSchema);
module.exports = Paper; 