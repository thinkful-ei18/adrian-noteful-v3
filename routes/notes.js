'use strict';

const express = require('express');
// Create an router instance (aka "mini-app")
const router = express.Router();

const Note = require('../models/note');

const mongoose = require('mongoose');

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {
  // console.log('Get All Notes');
  const searchTerm = req.query.searchTerm;
  let filter = {};

  if (searchTerm) {
    const re = new RegExp(searchTerm, 'i');
    filter.title = { $regex: re };
  }

  return Note.find(filter)
    .select('title created')
    .sort('created')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });

  // return Note
  //   .find()
  //   .then(results => {
  //     res.status(200).json(results);
  //   })
  //   .catch(next);
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {

// Validate BEFORE we try to make a request!
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  return Note
    .findById(req.params.id)
    .select('id title content')
    .then(result => {
      // Return an OBJECT!!!
      // console.log('Object:', result);
      if (result) {
        res.status(200).json(result);
      } else {
        next();
        // res.status(404).send('ID doesn\'t exist'.);
        // console.error('Note doesn\'t exist');
      }
    })
    .catch(next);
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {

// const noteTitle = req.params.title;
// const noteContent = req.params.content;

  Note
    .create({
      title: req.body.title,
      content: req.body.content
    })
    // .select('id title content id')
    .then (result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next);

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = { title, content };
  const options = { new: true };

  Note.findByIdAndUpdate(id, updateItem, options)
    .select('id title content')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {

  Note
    .findByIdAndRemove(req.params.id)
    .then (() => {
      res.status(204).end();
    })
    .catch(next);
});

module.exports = router;