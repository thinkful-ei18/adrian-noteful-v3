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
      res.json(results);
    })
    .catch(next);
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
    })
    .catch(next);
});

router.post('/tags', function (req, res, next) {

  const { name } = req.body;
  const newTag = { name };

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Tag
    .create(newTag)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The `tag` name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/tags/:id', function (req, res, next) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  const updateTag = { name };
  const options = { new: true };

  Tag
    .findByIdAndUpdate(id, updateTag, options)
    .select('id name')
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The `tag` name already exists');
        err.status = 400;
      }
      next(err);
    });

});





module.exports = router;