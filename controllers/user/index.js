const UserModel = require('../../models/user')

async function index(req, res) {
  const result = await UserModel.find({})
  res.json(result)
}

async function store(req, res) {
  console.log(req.body);
  try {
    await UserModel.create(req.body)
    res.send({ status: 'success' })
  } catch (err) {
    res.sendStatus(403)
  }
}

module.exports = { index, store }