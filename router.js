const express = require('express');
const userController = require('./controllers/user');
const authController = require('./controllers/auth')

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Welcome to Kuskus Blog!' });
});

router.get('/users', userController.index);
router.post('/users', userController.store);
router.put('/users/:id', userController.update);
router.post('/auth/login', authController.login);

module.exports = router;
