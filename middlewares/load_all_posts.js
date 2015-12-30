var Post = require('../data/models/post');
var dateformat = require('dateformat');

function loadAllPosts(req, res, next) {
  Post.find({}).sort('-time').exec(function(err, posts) {
    if (err) next(err);

    //create date_created property in each post
    for (var i = 0; i < posts.length; i++) {
      var date_created = dateformat(posts[i].time);
      posts[i].date_created = date_created;
    }
    
    req.posts = posts;
    next();
  });
}

module.exports = loadAllPosts;