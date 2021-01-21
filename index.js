const express = require('express');
const mongoose = require('mongoose');
const jwt = require('express-jwt');
const path = require('path');
const router = require('./router');
const { secretKey, } = require('./constants');
const app = express();
const port = +process.env.PORT || 8080

mongoose.connect('mongodb://localhost:27017/express-blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(jwt({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: ['/auth/login'] }));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ status: 'noAuth' });
  }
});
app.use('/', router);

app.listen(port, () => {
  console.log(`Blog app listening at http://localhost:${port}`);
});
