var Post = require('../data/models/post');

function loadPost(req,res,next){
  var id = req.params.id;

  Post.findById(id, function(err, post){
    if(err){
      return next(err);
    }
    if(!post){
      return res.send('Not found', 404);
    }
    req.post = post;
    next();
  });
}

module.exports = loadPost;