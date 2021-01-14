const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const jwt = require('express-jwt');
const router = require('./router');
const { secretKey } = require('./constants');
const app = express()
const port = 3001

mongoose.connect("mongodb://localhost:27017/express-blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jwt({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: ['/auth/login'] }));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ status: 'invalidToken' });
  }
});
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})