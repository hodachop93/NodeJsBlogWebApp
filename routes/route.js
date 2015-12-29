var express = require('express');
var User = require('../data/models/user');
var Post = require('../data/models/post');
var loadUser = require('../middlewares/load_user.js');
var uploadPost = require('../middlewares/upload_post')
var router = express.Router();
var sess;

router.get('/', function(req, res, next) {
  sess = req.session;
  if (sess.username) {
    res.redirect('/' + sess.username);
  } else {
    res.redirect('/login');
  }
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  User.findOne({
    username: req.body.username
  }, function(err, user, next) {
    if (err) next(err);
    if (!user) {
      var err = new Error('Username or password incorrect');
      console.log(err);
      err.status = 404;
      next(err);
    }
    res.redirect('/' + req.body.username);
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

router.get('/:username', function(req, res, next) {
  res.render('home', {
    username: req.params.username
  });
});

router.get('/:username/new-post', function(req, res, next) {
  res.render('new-post');
});

router.post('/:username/new-post', uploadPost, function(req, res, next) {
  //redirect to home page
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
