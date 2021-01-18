const slug = require('slug')
const sanitizeHtml = require('sanitize-html');
const PostModel = require('../../models/post')

function index(req, res) {
  const { user: { id } } = req
  // console.log(req.user);
  PostModel.find({ authorId: id })
    .then(result => {
      res.json(result)
    })
    .catch(err => console.error(err))
}

function show(req, res) {
  const { params: { id }, user: { id: userId } } = req
  PostModel.findById(id)
    .then(result => {
      if (result.authorId === userId) {
        res.json(result)
      } else {
        res.sendStatus(403)
      }
    })
    .catch(err => {
      res.sendStatus(404)
    })
}

async function store(req, res) {
  const { body: { title = '', body = '' }, user: { id } } = req
  const cleanBody = sanitizeHtml(body)
  if (title) {
    let i = 0
    let slugged = slug(title)
    let foundPost = await PostModel.findOne({ slug: slugged })
    while (foundPost) {
      i++
      slugged = slug(title + '-' + i)
      try {
        foundPost = await PostModel.findOne({ slug: slugged })
      } catch (err) {
        console.error(err);
      }
    }
    PostModel.create({ title, body: cleanBody, slug: slugged, authorId: id, createdAt: Date.now(), lastModified: Date.now() })
      .then(post => {
        // console.log(post);
        res.send({ status: 'success' })
      })
      .catch(err => console.error(err))
  } else {
    res.sendStatus(403)
  }
}

function update(req, res) {
  const { body: { title = '', body = '', }, params: { id }, user: { id: userId } } = req
  const cleanBody = sanitizeHtml(body)
  if (title) {
    PostModel.findById(id)
      .then(result => {
        if (result.authorId === userId) {
          PostModel.findByIdAndUpdate(id, { title, body: cleanBody, lastModified: Date.now() }, function (params) {
            res.json({ status: 'success' })
          })
        } else {
          res.sendStatus(403)
        }
      })
      .catch(err => {
        res.sendStatus(404)
      })
  } else {
    res.status(403).send({ status: 'noTitle' })
  }
}

function destroy(req, res) {
  const { params: { id }, user: { id: userId } } = req
  PostModel.findById(id)
    .then(result => {
      if (result.authorId === userId) {
        PostModel.findByIdAndDelete(id, function () {
          res.json({ status: 'success' });
        })
      } else {
        res.sendStatus(403)
      }
    })
    .catch(err => {
      res.sendStatus(404)
    })
}

module.exports = { index, store, show, update, destroy }