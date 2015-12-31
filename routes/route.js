var express = require('express');
var User = require('../data/models/user');
var Post = require('../data/models/post');
var loadUser = require('../middlewares/load_user.js');
var uploadPost = require('../middlewares/upload_post')
var loadAllPosts = require('../middlewares/load_all_posts');
var loadAllPostsByUsername = require('../middlewares/load_all_posts_by_username');
var loadPost = require('../middlewares/load_post');
var updatePost = require('../middlewares/update_post');
var showPost = require('../middlewares/show_post');
var deletePost = require('../middlewares/delete_post');

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
    title: 'Home',
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
    console.log(err);
    if (err) next(err);
    if (!user) {
      /*var err = new Error('Username or password incorrect');
      err.status = 404;
      next(err);*/
      res.redirect('/login');
    } else {
      sess.username = req.body.username;
      res.redirect('/');
    }


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
      return res.status(409).send('Conflict');
    }
    User.create(req.body, function(err) {
      if (err) {
        return next(err);
      }
      req.session.username = req.body.username;
      res.redirect('/' + req.body.username + '/posts');
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
    res.render('home', {
      title: 'Your posts',
      loggedIn: true,
      username: req.params.username,
      posts: req.posts,
      editable: true
    });
  } else {
    res.redirect('/login');
  }

});

router.get('/:username/new-post', function(req, res, next) {
  sess = req.session;
  if (sess.username) {
    res.render('new-post', {
      loggedIn: true,
      username: req.params.username,
      title: 'New post'
    });
  }
});

router.post('/:username/new-post', uploadPost, function(req, res, next) {
  res.redirect('/' + req.params.username + '/posts');
});

router.get('/:username/posts/:id', loadPost, showPost, updatePost, deletePost);

router.get('/:username/posts/:id/edit', loadPost, function(req, res, next) {
  sess = req.session;
  if (sess.username) {
    res.render('new-post', {
      title: 'Edit post',
      loggedIn: true,
      post: req.post
    });
  }
});

router.post('/:username/posts/:id/edit', uploadPost, function(req, res, next) {
  res.redirect('/' + req.params.username + '/posts');
});

module.exports = router;