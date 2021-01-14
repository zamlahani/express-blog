const UserModel = require('../../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../../constants')

async function login(req, res) {
  const { username, password } = req.body
  const foundUser = await UserModel.findOne({ username });
  // console.log(foundUser);
  if (foundUser) {
    bcrypt.compare(password, foundUser.password, function (err, result) {
      if (result) {
        var token = jwt.sign({ username }, secretKey);
        res.json({ status: 'success', token })
      } else {
        res.status(403).json({ status: 'wrongPassword' })
      }
    })
  } else {
    res.status(404).json({ status: 'noUsernameFound' })
  }
}

module.exports = { login }