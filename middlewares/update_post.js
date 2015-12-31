var Post = require('../data/models/post');

function updatePost(req, res, next) {
  if (req.query.action == 'update') {
    res.redirect('/' + req.params.username +
      '/posts/' + req.params.id + '/edit');
  } else {
    next();
  }
}

module.exports = updatePost;