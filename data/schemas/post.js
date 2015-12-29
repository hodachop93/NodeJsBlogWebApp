var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  teaser: String,
  content: String,
  time: Number,
  author: String,
  picture: String
}, {versionKey: false});

module.exports = PostSchema;