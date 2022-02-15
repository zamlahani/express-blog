const express = require('express');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const router = require('./router');
const { secretKey, dbUrl, cloudinaryCloudName, cloudinaryKey, cloudinarySecret } = require('./constants');
const app = express();
const port = +process.env.PORT || 8080;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
});

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  jwt({ secret: secretKey, algorithms: ['HS256'] }).unless({
    path: ['/', '/auth/login', { url: '/posts', methods: ['GET'] }],
  })
);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ status: 'noAuth' });
  }
});
app.use('/', router);

app.listen(port, () => {
  console.log(`Blog app listening at http://localhost:${port}`);
});
