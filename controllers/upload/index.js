const moment = require('moment'); // require
const fs = require('fs');
const path = require('path')
const { hostDomain, root } = require('../../constants');

function index(req, res) {
  // console.log(req.files);
  if (req.files.file) {
    const sub = moment().format('YYYY/MM')
    const dest = path.join('public', 'uploads', req.user.id, sub,)
    const fileName = Date.now() + '.jpg'
    fs.access(dest, function (error) {
      if (error) {
        // console.log("Directory does not exist.", dest);
        fs.mkdir(dest, { recursive: true }, (errorMkdir) => {
          if (errorMkdir) {
            // console.log('errormkdir');
          } else {
            saveFile(req, res, dest, fileName)
          }
        });
      } else {
        // console.log("Directory exists.", dest);
        saveFile(req, res, dest, fileName)
      }
    });

  } else {
    res.status(404).send({ status: 'error' })
  }
}

function saveFile(req, res, dest, fileName) {
  const target = `${root}/${dest}/${fileName}`
  return req.files.file.mv(target)
    .then(() => {
      res.send(`${hostDomain}/${dest.replace(/\\/g, '/').replace('public', 'static')}/${fileName}`)
    })
    .catch(err => console.error(err))
}

module.exports = { index }