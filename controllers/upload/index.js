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
        Promise.all([prom1 , prom2])
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

function public(req, res) {
  const target = path.join(cloudinaryCloudFolder, moment().format('YYYY/MM')).replace(/\\/g, '/');
  const form = formidable();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log('🚀 ~ file: index.js ~ line 65 ~ form.parse ~ err', err);
      res.status(403).send({ err });
      return;
    }
    const { description = '' } = fields;
    Jimp.read(files.file.path)
      .then((img) => {
        const prom1 = img.quality(70).getBase64Async(Jimp.AUTO);
        const prom2 = img.quality(70).cover(200, 200).getBase64Async(Jimp.AUTO);
        Promise.all([prom1, prom2])
          .then((results) => {
            const promises = results.map((val) => cloudinary.uploader.upload(val, { folder: target }));
            Promise.all(promises)
              .then((upRes) => {
                Media.create({
                  description,
                  uploaderId: 'public',
                  files: {
                    original: upRes[0],
                    thumbnail: upRes[1],
                  },
                })
                  .then((modelRes) => {
                    res.json(modelRes);
                  })
                  .catch((err) => {
                    console.log('🚀 ~ file: index.js ~ line 44 ~ .then ~ err', err);
                    res.sendStatus(403);
                  });
              })
              .catch((err) => {
                console.log('🚀 ~ file: index.js ~ line 82 ~ .then ~ upload err', err);
                res.send(err);
              });
          })
          .catch((err) => {
            console.log('🚀 ~ file: index.js ~ line 81 ~ .then ~ get base 64 err', err);
            res.send(err);
          });
      })
      .catch((err) => {
        console.log('🚀 ~ file: index.js ~ line 80 ~ .then ~ Jimp read err', err);
        res.send(err);
      });
  });
}

module.exports = { index, public };
