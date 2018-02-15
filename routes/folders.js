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
    .select('id name')
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

router.post('/folders', (req, res, next) => {
  Folder
    .create({
      name: req.body.name
    })
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next);
});

router.put('/folders/:id', (req, res, next) => {

  const { id } = req.params;
  const { name } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = { name };
  const options = { new: true };

  Folder
    .findByIdAndUpdate(id, updateItem, options)
    .select('id name')
    .then(result => {
      res.json(result);
    })
    .catch(next);

});

router.delete('/folders/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  Folder
    .findByIdAndRemove(req.params.id)
    .then(res => {
      res.status(204).end();
    })
    .catch(next);

});



module.exports = router;