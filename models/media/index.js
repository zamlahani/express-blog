const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  description: { type: String },
  uploaderId: { type: String },
  files: { type: Object },
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
