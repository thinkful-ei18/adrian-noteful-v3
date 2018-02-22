'use strict';

const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  name: {type: String, required: true}});

tagsSchema.index({ name: 1, userId: 1}, { unique: true });

tagsSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Tag = mongoose.model('Tag', tagsSchema);

module.exports = Tag;