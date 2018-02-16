'use strict';

const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({name: {type: String, unique: true}});

tagsSchema.index({name: 'text'});

tagsSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Tag = mongoose.model('Tag', tagsSchema);

module.exports = Tag;