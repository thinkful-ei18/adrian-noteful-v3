'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {fullname: {type: String}},
  {username: {type: String, unique: true}},
  {password: {type: String}}
);

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

const User = mongoose.model('Note', userSchema);

module.exports = User;