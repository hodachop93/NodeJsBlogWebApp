function showPost(req, res, next) {
  var sess = req.session;
  if (req.post) {
    if (sess.username) {
      res.render('post-content', {
        loggedIn: true,
        username: req.params.username,
        post: req.post
      });
    }else{
      res.render('post-content', {
        loggedIn: false,
        username: req.params.username,
        post: req.post
      });
    }
  } else {
    next();
  }
}

module.exports = showPost;