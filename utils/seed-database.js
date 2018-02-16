'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {MONGODB_URI} = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

const seedNotes = require('../db/seed/notes');
const seedFolders = require('../db/seed/folders');
const seedTags = require('../db/seed/tags');

mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(seedNotes),
      Folder.insertMany(seedFolders),
      Tag.insertMany(seedTags),
      Note.createIndexes(),
      Folder.createIndexes(),
      Tag.createIndexes()
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });




// mongoose.connect(MONGODB_URI)
//   .then (() => {
//     return mongoose.connection.db.dropDatabase()
//       .then(result => {
//         console.info(`Dropped database: ${result}`);
//       });
//   })
//   .then (() => {
//     return Folder.insertMany(seedFolders)
//       .then (results => {
//         console.info(`Inserted ${results.length} folders`);
//       });
//   })
//   .then (() => {
//     return Note.insertMany(seedNotes)
//       .then (results => {
//         console.info(`Inserted ${results.length} notes`);
//       });
//   })
//   .then (() => {
//     return Note.createIndexes();
//   })
//   .then (() => {
//     return mongoose.disconnect()
//       .then (() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });