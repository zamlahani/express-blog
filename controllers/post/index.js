const slug = require('slug');
const sanitizeHtml = require('sanitize-html');
const Post = require('../../models/post');

function index(req, res) {
  // console.log(req.user);
  Promise.all([
    Post.find({})
      .select('_id title body slug createdAt lastModified')
      .populate({ path: 'author', select: 'username fullName id' }),
    Post.estimatedDocumentCount(),
  ])
    .then((results) => {
      const [posts, count] = results;
      res.json({ count, posts });
    })
    .catch((err) => {
      // console.log('~ err', err)
      res.sendStatus(403);
    });
}

function show(req, res) {
  const {
    params: { id },
    user: { id: userId },
  } = req;
  Post.findById(id)
    .then((result) => {
      if (result.authorId === userId) {
        res.json(result);
      } else {
        res.sendStatus(403);
      }
    })
    .catch((err) => {
      res.sendStatus(404);
    });
}

async function store(req, res) {
  const {
    body: { title = '', body = '' },
    user: { id },
  } = req;
  const cleanBody = sanitizeHtml(body);
  if (title) {
    let i = 0;
    let slugged = slug(title);
    let foundPost = await Post.findOne({ slug: slugged });
    while (foundPost) {
      i++;
      slugged = slug(title + '-' + i);
      try {
        foundPost = await Post.findOne({ slug: slugged });
      } catch (err) {
        console.error(err);
      }
    }
    Post.create({
      title,
      body: cleanBody,
      slug: slugged,
      author: id,
      createdAt: Date.now(),
      lastModified: Date.now(),
    })
      .then((post) => {
        // console.log(post);
        res.json({ status: 'success' });
      })
      .catch((err) => console.error(err));
  } else {
    res.sendStatus(403);
  }
}

function update(req, res) {
  const {
    body: { title = '', body = '' },
    params: { id },
    user: { id: userId },
  } = req;
  const cleanBody = sanitizeHtml(body);
  if (title) {
    Post.findById(id)
      .then((result) => {
        if (result.authorId === userId) {
          Post.findByIdAndUpdate(id, { title, body: cleanBody, lastModified: Date.now() }, function (params) {
            res.json({ status: 'success' });
          });
        } else {
          res.sendStatus(403);
        }
      })
      .catch((err) => {
        res.sendStatus(404);
      });
  } else {
    res.status(403).send({ status: 'noTitle' });
  }
}

function destroy(req, res) {
  const {
    params: { id },
    user: { id: userId },
  } = req;
  Post.findById(id)
    .then((result) => {
      if (result.authorId === userId) {
        Post.findByIdAndDelete(id, function () {
          res.json({ status: 'success' });
        });
      } else {
        res.sendStatus(403);
      }
    })
    .catch((err) => {
      res.sendStatus(404);
    });
}

module.exports = { index, store, show, update, destroy };
