'use strict';

const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  create: {type: Date, default: Date.now}
});