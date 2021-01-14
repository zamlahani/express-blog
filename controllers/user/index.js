const UserModel = require('../../models/user')
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function index(req, res) {
  const result = await UserModel.find({})
  res.json(result)
  // console.log(req.user);
}

async function store(req, res) {
  const { body: { fullName, username, password } } = req
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      res.sendStatus(403)
    }
    try {
      await UserModel.create({ fullName, username, password: hash })
      res.send({ status: 'success' })
    } catch (err) {
      res.sendStatus(403)
    }
  });
}

async function update(req, res) {
  const { body: { fullName, username, password }, params: { id } } = req
  bcrypt.hash(password, saltRounds, async function (hashErr, hash) {
    if (hashErr) {
      res.sendStatus(403)
    }
    UserModel.updateOne({ _id: id }, { fullName, username, password: hash }, { runValidators: true }, function (err, result) {
      if (err) {
        res.sendStatus(403)
      } else {
        res.send({ status: 'success' })
      }
    });
  });
}

module.exports = { index, store, update }