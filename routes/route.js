var express = require('express');
var User = require('../data/models/user');
var Post = require('../data/models/post');
var loadUser = require('../middlewares/load_user.js');
var uploadPost = require('../middlewares/upload_post')
var loadAllPosts = require('../middlewares/load_all_posts');
var loadAllPostsByUsername = require('../middlewares/load_all_posts_by_username');
var loadPost = require('../middlewares/load_post');
var router = express.Router();
var sess;

router.get('/', loadAllPosts, function(req, res, next) {
  sess = req.session;

  var loggedIn = false;
  var username = null;
  if (sess.username) {
    loggedIn = true;
    username = sess.username;
  }
  res.render('home', {
    loggedIn: loggedIn,
    posts: req.posts,
    username: username
  });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  sess = req.session;
  User.findOne({
    username: req.body.username
  }, function(err, user, next) {
    if (err) next(err);
    if (!user) {
      var err = new Error('Username or password incorrect');
      err.status = 404;
      next(err);
    }
    sess.username = req.body.username;
    res.redirect('/' + req.body.username + '/posts');
  });
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.send('Conflict', 409);
    }
    User.create(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/' + req.body.username);
    });
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) next(err);
    res.redirect('login');
  });
});

router.get('/:username/posts', loadAllPostsByUsername, function(req, res, next) {
  sess = req.session;
  if (sess.username) {
    console.log('co the edit');
    res.render('home', {
      loggedIn: true,
      username: req.params.username,
      posts: req.posts,
      editable: true
    });
  }else{
    /*var err = new Error('Not found');
    err.status = 404;
    next(err);*/
    res.redirect('/login');
  }

});

router.get('/:username/new-post', function(req, res, next) {
  res.render('new-post');
});

router.post('/:username/new-post', uploadPost, function(req, res, next) {
  //redirect to home page
  res.redirect('/' + req.params.username + '/' + posts);
});

router.get('/:username/posts/:id', loadPost, function(req, res, next) {
  res.render('post-content', {
    post: req.post
  });
});

module.exports = router;