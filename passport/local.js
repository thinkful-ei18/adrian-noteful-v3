'use strict';


const express = require('express');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const User = require('../models/user');

const localStrategy = new LocalStrategy((username, password, done) => {

  let user;
  User.findOne({ username })
    .then(results => {
      user = results;
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password',
          location: 'password'
        });
      }
      return done(null, user);
    })
    .catch(err => {
      if(err.reason === 'LoginError') {
        return done(null, false);
      }
      return done(err);
    });


  // try {
  //   if (username !== 'thinkfulstudent123') {
  //     console.log('Incorrect username!');
  //     return done(null, false);
  //   }

  //   if (password !== 'iamadrian') {
  //     console.log('Incorrect password!');
  //     return done(null, false);
  //   }

  //   const user = { username, password };
  //   return done(null, user);

  // } catch (err) {
  //   done(err);
  // }

});

module.exports = localStrategy;

// app.listen(process.env.PORT || 8080, function () {
//   console.info(`Server listening on ${this.address().port}`);
// });

// try {
//   if (username !== 'thinkfulstudent123') {
//     console.log('Incorrect username!');
//     return done(null, false);
//   }

//   if (password !== 'iamadrian') {
//     console.log('Incorrect password!');
//     return done(null, false);
//   }

//   const user = { username, password };
//   return done(null, user);

// } catch (err) {
//   done(err);
// }