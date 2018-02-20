'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user');

router.post('/users', function (req, res, next) {

  const { fullname, username, password } = req.body;
  const newUser = { fullname, username, password };

  User
    .create(newUser)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next);

});

module.exports = router;