var Post = require('../data/models/post');
var dateformat = require('dateformat');

function loadPost(req,res,next){
  var id = req.params.id;

  Post.findById(id, function(err, post){
    if(err){
      return next(err);
    }
    if(!post){
      return res.send('Not found', 404);
    }
    //create date_created property for post
    post.date_created = dateformat(post.time);
    req.post = post;
    next();
  });
}

module.exports = loadPost;