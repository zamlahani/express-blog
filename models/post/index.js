const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, },
    body: { type: String, required: true, },
    slug: { type: String, unique: true, required: true },
    createdAt: { type: Date, default: Date.now, required: true, immutable: true },
    lastModified: { type: Date, default: Date.now, required: true, },
    authorId: { type: String, required: true, immutable: true }
  },
);

const UserModel = mongoose.model("post", postSchema);

module.exports = UserModel