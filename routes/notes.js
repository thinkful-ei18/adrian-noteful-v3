'use strict';

const express = require('express');
// Create an router instance (aka "mini-app")
const router = express.Router();

const Note = require('../models/note');

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {
  // console.log('Get All Notes');
  return Note
    .find()
    .then(results => {
      res.status(200).json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/notes/:id', (req, res, next) => {

  return Note
    .findById(req.params.id)
    .then(result => {
      // Return an OBJECT!!!
      // console.log('Object:', result);
      res.status(200).json(result);
    })
    .catch(() => {
      // anonymous function to catch 404 errors!
      next();
    });
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
    .then (result => {
      res.status(201).json(result);
    })
    .catch((err) => {
      next(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const toUpdate = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Note
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(result => {
      res.status(204).end();
    })
    .catch(() => {
      // anonymous function to catch 404 errors!
      next();
    });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();

});

module.exports = router;