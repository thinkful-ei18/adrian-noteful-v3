'use strict';


const express = require('express');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const User = require('../models/user');

User.findOne({ username })
  .then(user => {})
  .catch(err => {});