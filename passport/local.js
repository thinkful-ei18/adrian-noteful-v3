'use strict';


const express = require('express');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const User = require('../models/user');

const localStrategy = new LocalStrategy((username, password, done) => {
  try {
    if (username !== 'thinkfulstudent123') {
      console.log('Incorrect username!');
      return done(null, false);
    }

    if (password !== 'iamadrian') {
      console.log('Incorrect password!');
      return done(null, false);
    }

    const user = { username, password };
    done(null, user);

  } catch (err) {
    done(err);
  }
});

// passport.use(localStrategy);
// const localAuth = passport.authenticate('local', { session: false });

// app.post('/api/secret'), localAuth, function (req, res) {
//   console.log(`${req.user.username} successfully logged in.`);
//   res.json({
//     message: 'never forget!',
//     username: req.user.username
//   });
// };

// app.listen(process.env.PORT || 8080, function () {
//   console.info(`Server listening on ${this.address().port}`);
// });