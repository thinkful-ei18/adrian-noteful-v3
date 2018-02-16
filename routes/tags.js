'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Tag = require('../models/tag');

router.get('/tags', function (req, res, next) {
  return Tag
    .find()
    .select('name')
    .sort('name')
    .then(results => {
      res.json(results)
        .catch(next);
    });
});

router.get('/tags/:id', function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  return Tag
    .findById(req.params.id)
    .select('name')
    .then(result => {
      if (!result) {
        const error = new Error('`id` not found!');
        error.status = 404;
        return next(error);
      } else {
        res.json(result);
      }
    });
});

router.post('/tags', function (req, res, next) {



});



module.exports = router;