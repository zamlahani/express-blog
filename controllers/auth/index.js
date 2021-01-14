const UserModel = require('../../models/user')
const bcrypt = require('bcrypt');

async function login(req, res) {
  const { username, password } = req.body
  const foundUser = await UserModel.findOne({ username });
  console.log(foundUser);
  if (foundUser) {
    bcrypt.compare(password, foundUser.password, function (err, result) {
      if (result) {
        res.json({ status: 'success' })
      } else {
        res.status(403).json({ status: 'wrongPassword' })
      }
    })
  } else {
    res.status(404).json({ status: 'noUsernameFound' })
  }
}

module.exports = { login }