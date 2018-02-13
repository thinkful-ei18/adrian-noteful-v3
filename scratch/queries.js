'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {MONGODB_URI} = require('../config');

const Note = require('../models/note');


// Find by ID
// mongoose.connect(MONGODB_URI)
//   .then (() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       const re = new RegExp(searchTerm, 'i');
//       filter.title ={$regex: re};
//     }

//     return Note.find(filter)
//       .select('title created')
//       .sort('created')
//       .then(results => {
//         console.log(results);
//       })
//       .catch(console.error);
//   })
//   .then (()=> {
//     return mongoose.disconnect()
//       .then (() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch (err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// ************* Get all notes **********************
// mongoose.connect(MONGODB_URI)
//   .then (() => {
//     return Note
//       .find()
//       .then(result => {
//         console.log(result);
//       });
//   })
//   .then (()=> {
//     return mongoose.disconnect()
//       .then (() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch (err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


// ************* Get note by ID **********************
// mongoose.connect(MONGODB_URI)
//   .then (() => {
//     return Note
//       .findById('000000000000000000000006')
//       .then(result => {
//         console.log(result);
//       });
//   })
//   .then (()=> {
//     return mongoose.disconnect()
//       .then (() => {
//         console.info('Disconnected');
//       });
//   })
//   .catch (err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// ************* Add a note **********************
