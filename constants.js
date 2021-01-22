require('dotenv').config();

const port = process.env.PORT;
const root = __dirname;
const hostDomain = process.env.DOMAIN;
const secretKey = process.env.SECRET_KEY;
const dbUrl = process.env.DB_URL;
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCloudFolder = process.env.CLOUDINARY_CLOUD_FOLDER;
const cloudinaryKey = process.env.CLOUDINARY_KEY;
const cloudinarySecret = process.env.CLOUDINARY_SECRET;

module.exports = {
  secretKey,
  port,
  hostDomain,
  root,
  dbUrl,
  cloudinaryCloudName,
  cloudinaryCloudFolder,
  cloudinaryKey,
  cloudinarySecret,
};
