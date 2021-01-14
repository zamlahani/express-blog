const express = require('express');
const userController = require('./controllers/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Welcome to Kuskus Blog!' });
});

router.get('/users', userController.index);

module.exports = router;
