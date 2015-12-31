var Post = require('../data/models/post');

function deletePost(req, res, next) {
  if (req.query.action == 'delete') {
    var id = req.params.id;
    Post.remove({
      _id: id
    }, function(err) {
      if (err) next(err);
      res.redirect('/' + req.params.username + '/posts');
    });
  }else{
    var error = new Error('Not found action');
    error.status = 404;
    next(error);
  }
}

module.exports = deletePost;