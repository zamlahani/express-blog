const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const router = require('./router')
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
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})