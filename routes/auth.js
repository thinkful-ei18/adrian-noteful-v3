'use strict';

const JWT_SECRET = require('JWT_SECRET').config();
const JWT_EXPIRY = require('JWT_EXPIRY').config();


const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const options = {session: false, failwithError: true};

const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, function (req, res) {
  console.log(`${req.user.username} successfully logged in.`);
  return res.json(req.user);
});



module.exports = router;