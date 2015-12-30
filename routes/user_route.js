/*var express = require('express');
var uploadPost = require('../middlewares/upload_post')
var loadPost = require('../middlewares/load_post')
var loadAllPostsByUsername = require('../middlewares/load_all_posts_by_username');
var router = express.Router();


router.get('/posts',loadAllPostsByUsername, function(req, res, next) {
  console.log(req.params);
  res.render('home', {
    username: req.params.username,
    posts: req.posts
  });
});

router.get('/new-post', function(req, res, next) {
  res.render('new-post');
});

router.post('/new-post', uploadPost, function(req, res, next) {
  //redirect to home page
  res.redirect('/');
});

router.get('/posts/:id', loadPost, function(req,res,next){
  res.render('post-content', {
    post: req.post
  });
});

module.exports = router;*/