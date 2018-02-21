'use strict';
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const options = {session: false, failwithError: true};

const localAuth = passport.authenticate('local', options);

function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, function (req, res) {
  console.log(`${req.user.username} successfully logged in.`);
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});



module.exports = router;