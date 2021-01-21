const moment = require('moment'); // require
const fs = require('fs');
const path = require('path');
const { hostDomain, root } = require('../../constants');
const MediaModel = require('../../models/media');

function index(req, res) {
  // console.log(req.files);
  if (req.files.file) {
    const sub = moment().format('YYYY/MM');
    const dest = path.join('public', 'uploads', req.user.id, sub);
    const fileName = Date.now() + '.jpg';
    saveFile(req, res, dest, fileName);
  } else {
    res.status(404).send({ status: 'error' });
  }
}

function saveFile(req, res, dest, fileName) {
  const target = `${root}/${dest}/${fileName}`;
  const {
    user: { id },
    body: { description = '' },
  } = req;
  const clientPath = dest.replace(/\\/g, '/').replace('public', 'static');
  return req.files.file
    .mv(target)
    .then(() => {
      MediaModel.create({ fileName, description, path: clientPath, uploaderId: id, uploadedAt: Date.now() })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.sendStatus(404);
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
}

module.exports = { index };
