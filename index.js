const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const jwt = require('express-jwt');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = require('./router');
const { secretKey, port } = require('./constants');
const app = express()

mongoose.connect("mongodb://localhost:27017/express-blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jwt({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: ['/auth/login'] }));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ status: 'noAuth' });
  }
});
app.use(fileUpload());
app.use('/', router)

app.listen(port, () => {
  console.log(`Blog app listening at http://localhost:${port}`)
})