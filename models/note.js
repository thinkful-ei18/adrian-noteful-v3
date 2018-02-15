'use strict';

const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
  title: {type: String, required: true, index: true},
  content: {type: String, required: true, index: true},
  created: {type: Date, default: Date.now},
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }
});

notesSchema.index({ title: 'text', content: 'text' });

notesSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Note = mongoose.model('Note', notesSchema);

module.exports = Note;