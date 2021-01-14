const UserModel = require('../../models/user')

async function index(req, res) {
  const result = await UserModel.find({})
  res.json(result)
}

async function store(req, res) {
  console.log(req.body);
  const { body: { fullName, username, password } } = req
  try {
    await UserModel.create({ fullName, username, password })
    res.send({ status: 'success' })
  } catch (err) {
    res.sendStatus(403)
  }
}

async function update(req, res) {
  const { body: { fullName, username, password }, params: { id } } = req
  UserModel.updateOne({ _id: id }, { fullName, username, password }, { runValidators: true }, function (err, result) {
    if (err) {
      res.sendStatus(403)
    } else {
      res.send({ status: 'success' })
    }
  });
}

module.exports = { index, store, update }