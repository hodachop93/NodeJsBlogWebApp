var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var Post = require('../data/models/post');

module.exports = uploadPost;

function uploadPost(req, res, next) {
  var form = new formidable.IncomingForm();

  var saveDir = path.resolve(__dirname, '../public/upload/');
  form.uploadDir = path.resolve(__dirname, '../public/tmp/');

  var id = req.params.id;

  if (id) {
    //update post
    updateExistPost(id, form, req, next);
  } else {
    // create a new post
    createNewPost(form, req, next);
  }

}

function updateExistPost(id, form, req, next) {
  form.parse(req, function(err, fields, files) {
    var post = createModel(fields, req);
    if (files.picture.size != 0) {
      uploadPicture(post, files, next);
    }
    var updateData = post.toObject();
    delete updateData._id;
    console.log(updateData);
    Post.findOneAndUpdate({
      '_id': id
    }, updateData, {
      upsert: true
    }, function(err) {
      console.log(err);
      if (err) next(err);
      next();
    });

  });

}

function createNewPost(form, req, next) {
  form.parse(req, function(err, fields, files) {
    var post = createModel(fields, req);
    if (files.picture.size != 0) {
      uploadPicture(post, files, next);
    }else{
      post.picture = "default_image.jpg";
      post.save(function(err) {
      if (err) next(err);
      next();
    });
    }
  });
}

function uploadPicture(post, files, next) {
  var extension = path.extname(files.picture.name);
  var newNameFile = post.author + '_' + post.time + extension;
  fs.rename(files.picture.path, saveDir + '/' + newNameFile, function(err) {
    if (err) {
      next(err);
    }
    post.picture = newNameFile;
    post.save(function(err) {
      if (err) next(err);
      next();
    });
  });
}

function createModel(fields, req) {
  var post = new Post;
  post.title = fields.title;
  post.teaser = fields.teaser;
  post.content = fields.content;
  post.author = req.params.username;
  post.time = new Date().valueOf();
  return post;
}