const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  fileName: { type: String },
  description: { type: String },
  ext: { type: String },
  path: { type: String, required: true },
  uploaderId: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
