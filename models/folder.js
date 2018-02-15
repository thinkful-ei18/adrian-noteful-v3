'use strict';

const mongoose = require('mongoose');

const foldersSchema = new mongoose.Schema({
  name: {type: String, required: true, unique : true, dropDups: true}
});


foldersSchema.index({name: 'text'});

foldersSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Folder = mongoose.model('Folder', foldersSchema);

module.exports = Folder;