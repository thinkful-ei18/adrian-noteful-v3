'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const localStrategy = require('../passport/local');


const options = {session: false, failwithError: true};

passport.use(localStrategy);
const localAuth = passport.authenticate('local', options);

router.post('/api/secret'), localAuth, function (req, res) {
  console.log(`${req.user.username} successfully logged in.`);
  res.json(req.user);
};

module.exports = router;