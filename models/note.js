'use strict';

const mongoose = require('mongoose');

const Note = mongoose.model('Note', notesSchema);

const notesSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  create: {type: Date, default: Date.now}
});

Note.create({
  title: 'Are cats evil?',
  content: 'Of course!'
});