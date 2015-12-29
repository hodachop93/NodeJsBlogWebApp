var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var Post = require('../data/models/post');

module.exports = uploadPost;

function uploadPost(req, res, next) {
  var form = new formidable.IncomingForm();

  var saveDir = path.resolve(__dirname, '../public/upload/');
  form.uploadDir = path.resolve(__dirname, '../public/tmp/');

  form.parse(req, function(err, fields, files) {
    var post = new Post;
    console.log(fields);
    post.title = fields.title;
    post.teaser = fields.teaser;
    post.content = fields.content;
    post.author = req.params.username;
    post.time = new Date().valueOf();

    var extension = path.extname(files.picture.name);
    var newNameFile = post.author + '_' + post.time + extension;
    fs.rename(files.picture.path, saveDir + '/' + newNameFile, function(err) {
      if (err) {
        next(err);
      }
      post.picture = newNameFile;
      post.save(function(err) {
        if(err) next(err);
        next();
      });
    });
  });
}
