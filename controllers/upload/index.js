const moment = require('moment'); // require
const path = require('path');
const Jimp = require('jimp');
const formidable = require('formidable');
const { cloudinaryCloudFolder } = require('../../constants');
const Media = require('../../models/media');
const cloudinary = require('cloudinary').v2;

function index(req, res) {
  // console.log(req.files);
  const {
    user: { id },
  } = req;
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log('1', err.response);
      res.sendStatus(403);
      return;
    }
    // console.log('~ files', files);
    return Jimp.read(files.file.filepath)
      .then((img) => {
        // console.log('~ img', img)
        const prom1 = img.quality(70).getBase64Async(Jimp.AUTO);
        const prom2 = img.quality(70).cover(200, 200).getBase64Async(Jimp.AUTO);
        return Promise.all([prom1, prom2]);
      })
      .then((results) => {
        const target = path.join(cloudinaryCloudFolder, id, moment().format('YYYY/MM')).replace(/\\/g, '/');
        const uploadProms = results.map((val) => cloudinary.uploader.upload(val, { folder: target }));
        return Promise.all(uploadProms);
      })
      .then((upRes) => {
        const { description = '' } = fields;
        return Media.create({
          description,
          uploaderId: id,
          files: {
            original: upRes[0],
            thumbnail: upRes[1],
          },
        });
      })
      .then((modelRes) => {
        res.json(modelRes);
      })
      .catch((err) => {
        console.log(2, err);
        res.sendStatus(403);
      });
  });
}

module.exports = { index };
