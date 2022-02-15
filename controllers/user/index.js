const User = require('../../models/user');
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function index(req, res) {
  Promise.all([User.find({}).select('fullName username _id'), User.estimatedDocumentCount()])
    .then((results) => {
      const [users, count] = results;
      res.json({ count, users });
    })
    .catch((err) => {
      res.sendStatus(403);
    });
  // console.log(req.user);
}

function store(req, res) {
  const {
    body: { fullName, username, password },
  } = req;
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      res.sendStatus(403);
    }
    try {
      await User.create({ fullName, username, password: hash });
      res.json({ status: 'success' });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
}

function update(req, res) {
  const {
    body: { fullName, username },
    params: { id },
  } = req;
  User.updateOne({ _id: id }, { fullName, username }, function (err, result) {
    if (err) {
      res.sendStatus(404);
    } else {
      res.json({ status: 'success' });
    }
  });
}

function changePassword(req, res) {
  const {
    body,
    params: { id },
  } = req;
  const { oldPassword, newPassword } = body;
  if (newPassword && id) {
    bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
      if (err) {
        res.sendStatus(403);
      }
      User.updateOne({ _id: id }, { password: hash }, function (err, result) {
        if (err) {
          res.sendStatus(404);
        } else {
          res.json({ status: 'success' });
        }
      });
    });
  } else {
    res.status(403).send({ reqBody: { ...body } });
  }
}

module.exports = { index, store, update, changePassword };
