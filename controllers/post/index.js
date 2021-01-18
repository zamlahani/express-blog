const slug = require('slug')
const sanitizeHtml = require('sanitize-html');
const PostModel = require('../../models/post')

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

module.exports = { store }