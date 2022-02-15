const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now, required: true, immutable: true },
  lastModified: { type: Date, default: Date.now, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
