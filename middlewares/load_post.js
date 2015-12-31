var Post = require('../data/models/post');
var dateformat = require('dateformat');

function loadPost(req, res, next) {
  if (Object.keys(req.query).length === 0) {
    var id = req.params.id;
    Post.findById(id, function(err, post) {
      if (err) {
        next(err);
      }
      if (!post) {
        return res.send(404, 'Not found');
      }
      //create date_created property for post
      post.date_created = dateformat(post.time);
      req.post = post;
      next();
    });
  }else{
    next();
  }
}

module.exports = loadPost;