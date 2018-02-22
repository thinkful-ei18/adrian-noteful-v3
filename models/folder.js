'use strict';

const mongoose = require('mongoose');

const foldersSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  name: {type: String, required: true}
});

foldersSchema.index({ name: 1, userId: 1}, { unique: true });

foldersSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Folder = mongoose.model('Folder', foldersSchema);

module.exports = Folder;