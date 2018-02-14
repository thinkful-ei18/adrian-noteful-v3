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
//       .findById('000000000000000000000007')
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
// mongoose.connect(MONGODB_URI)
//   .then (() => {
//     return Note
//       .create({
//         title: 'Can cats run for president?',
//         content: 'Of course!',
//       })
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

// ************* Update a note **********************
// mongoose.connect(MONGODB_URI)
//   .then (() => {
//     return Note
//       .findOne({_id: '000000000000000000000007'}, {id: 1, title: 1, content: 1})
//       .then (foundNote => {
//         console.log(foundNote);
//         return foundNote;
//       })
//       .then(note => {
//         return note.update({$set: {title: 'about cats', content: 'cats are fun'}});
//       })
//       .then(result => {
//         return Note
//           .findOne({_id: '000000000000000000000007'}, {id: 1, title: 1, content: 1});
//       })
//       .then (updatedNote => {
//         console.log(updatedNote);
//       });
//     // .findByIdAndUpdate('000000000000000000000007', {$set: {title: 'CATS AND VIDEO GAMES', content: 'GO GREAT TOGETHER!'}}, {new: true})
//     // .then(result => {
//     //   console.log(result);
//     // });
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

// ************* delete a note **********************
// mongoose.connect(MONGODB_URI)
//   .then (() => {
//     return Note
//       .findByIdAndRemove('000000000000000000000007')
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

// .then (() => {
//   return Note
//   // findOne (and then delete the note)!
//     .findOne({_id: '000000000000000000000005'}, {id: 1, title: 1, content: 1})
//     .then(note => {
//       console.log('note received');
//       console.log(note);
//       return note.remove();
//     });

// ************* delete a note **********************
mongoose.connect(MONGODB_URI)
  .then(() => {
    return Note.find(
      { $text: { $search: '5' } },
      { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .then(results => {
        console.log(results);
      });
  })
  .then(() => {
    return mongoose.disconnect()
      .then(() => {
        console.info('Disconnected');
      });
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });