'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.post('/users', function (req, res, next) {

  let { fullname, username, password } = req.body;
  const newUser = { fullname, username, password };

  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  requiredFields.forEach(field => {
    if (typeof field !== 'string') {
      const err = new Error('All input fields must be a string');
      err.status = 400;
      return next(err);
    }
  });

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 400;
    return next(err);
  }

  // The username and password should not have leading or trailing whitespace. And the endpoint should not automatically trim the values
  requiredFields.forEach(field => req.body[field] = req.body[field].replace(/^\s+|\s+$/g, '') );

  // The username is a minimum of 1 character
  if (req.body.username.length < 1 ) {
    const err = new Error('Username must be at least 1 character');
    err.status = 411;
    return next(err);
  }

  // The password is a minimum of 8 and max of 72 characters
  if (!(req.body.password >= 8 && req.body.password <= 72)) {
    const err = new Error('Password must be a minimum of 8 and max of 72 characters');
    err.status = 406;
    return next(err);
  }

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullname
      };
      return User.create(newUser);
    })
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;