const express = require('express');
const userController = require('./controllers/user');
const authController = require('./controllers/auth');
const uploadController = require('./controllers/upload');
const postController = require('./controllers/post');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Kuskus Blog!' });
});

router.get('/users', userController.index);
router.post('/users', userController.store);
router.put('/users/:id', userController.update);
router.put('/change-password/:id', userController.changePassword);
router.post('/auth/login', authController.login);
router.post('/upload', uploadController.index);
router.get('/posts', postController.index);
router.get('/posts/:id', postController.show);
router.post('/posts', postController.store);
router.put('/posts/:id', postController.update);
router.delete('/posts/:id', postController.destroy);

module.exports = router;
