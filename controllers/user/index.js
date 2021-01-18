const UserModel = require('../../models/user')
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function index(req, res) {
  const result = await UserModel.find({})
  res.json(result.map((({ fullName, username, _id }) => ({ fullName, username, _id }))))
  // console.log(req.user);
}

function store(req, res) {
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

function update(req, res) {
  const { body: { fullName, username }, params: { id } } = req
  UserModel.updateOne({ _id: id }, { fullName, username }, { runValidators: true }, function (err, result) {
    if (err) {
      res.sendStatus(404)
    } else {
      res.send({ status: 'success' })
    }
  });
}

function changePassword(req, res) {
  const { body, params: { id } } = req
  const { oldPassword, newPassword } = body
  if (newPassword && id) {
    bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
      if (err) {
        res.sendStatus(403)
      }
      UserModel.updateOne({ _id: id }, { password: hash }, { runValidators: true }, function (err, result) {
        if (err) {
          res.sendStatus(404)
        } else {
          res.send({ status: 'success' })
        }
      });
    });
  } else {
    res.status(403).send({ reqBody: { ...body } })
  }
}

module.exports = { index, store, update, changePassword }