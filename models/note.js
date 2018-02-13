'use strict';

const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  create: {type: Date, default: Date.now}
});

notesSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Note = mongoose.model('Note', notesSchema);

Note.create({
  title: 'Are cats evil?',
  content: 'Of course!'
});

module.exports = Note;