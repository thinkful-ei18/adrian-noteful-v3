'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Folder = require('../models/folder');
const Note = require('../models/note');


router.get('/folders', (req, res, next) => {

  return Folder
    .find()
    .select('name')
    .then(results => {
      res.json(results);
    })
    .catch(next);

});







module.exports = router;