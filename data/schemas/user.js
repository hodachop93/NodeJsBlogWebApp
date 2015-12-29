var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
}, {versionKey: false});

module.exports = UserSchema;