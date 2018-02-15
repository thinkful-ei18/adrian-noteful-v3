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

router.get('/folders/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  return Folder
    .findById(req.params.id)
    .select('name')
    .then(result => {
      res.json(result);
    })
    .catch(next);
});






module.exports = router;