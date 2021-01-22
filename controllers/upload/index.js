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
      res.sendStatus(403);
      return;
    }
    Jimp.read(files.file.path)
      .then((img) => {
        const target = path.join(cloudinaryCloudFolder, id, moment().format('YYYY/MM')).replace(/\\/g, '/');
        const prom1 = img.quality(70).getBase64Async(Jimp.AUTO);
        const prom2 = img.quality(70).cover(200, 200).getBase64Async(Jimp.AUTO);
        Promise.all([prom1, prom2])
          .then((results) => {
            const { description = '' } = fields;
            const uploadProms = results.map((val) => cloudinary.uploader.upload(val, { folder: target }));
            Promise.all(uploadProms)
              .then((upRes) => {
                Media.create({
                  description,
                  uploaderId: id,
                  files: {
                    original: upRes[0],
                    thumbnail: upRes[1],
                  },
                })
                  .then((modelRes) => {
                    res.json(modelRes);
                  })
                  .catch((err) => {
                    res.sendStatus(403);
                  });
              })
              .catch((err) => {
                res.sendStatus(403);
              });
          })
          .catch((err) => {
            res.sendStatus(403);
          });
      })
      .catch((err) => {
        res.sendStatus(403);
      });
  });
}

module.exports = { index };
