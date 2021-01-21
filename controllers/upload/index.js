const moment = require('moment'); // require
const path = require('path');
const Jimp = require('jimp');
const formidable = require('formidable');
const { root } = require('../../constants');
const MediaModel = require('../../models/media');

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
        const target = path.join('public', 'uploads', id, moment().format('YYYY/MM'));
        const fullPath = path.join(root, target);
        const fileName = moment().valueOf();
        const nameCropped = fileName + '-200x200';
        const ext = '.jpg';
        const prom1 = img.quality(70).write(fullPath + '/' + fileName + ext);
        const prom2 = img
          .quality(70)
          .cover(200, 200)
          .write(fullPath + '/' + nameCropped + ext);
        Promise.all([prom1, prom2])
          .then((results) => {
            // console.log("🚀 ~ file: index.js ~ line 34 ~ .then ~ results", results)
            const clientPath = target.replace('public', 'static').replace(/\\/g, '/');
            const { description = '' } = fields;
            MediaModel.create({
              fileName,
              description,
              ext,
              path: clientPath,
              uploaderId: id,
              uploadedAt: Date.now(),
            })
              .then((result) => {
                res.json(result);
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
