'use strict';

const express = require('express');
// Create an router instance (aka "mini-app")
const router = express.Router();

const Note = require('../models/note');

const mongoose = require('mongoose');

/* ========== GET/READ ALL ITEM ========== */
router.get('/notes', (req, res, next) => {
  // console.log('Get All Notes');

  const { searchTerm, folderId, tagId } = req.query; //
  // console.log(searchTerm, folderId);
  // const folderId = req.query.folderId;

  let filter = {}; // 1st find argument; Criteria for filtering our results; We use the searchTerm query string
  let projection = {}; // 2nd find argument; Criteria for what we want to return
  let sort = 'created'; // We want to sort by the note's created date.

  if (searchTerm) {
    filter.$text = {$search: searchTerm, $language: 'none'}; // $text: $search = Options for our $text search
    projection.score = {$meta: 'textScore'}; // text search queries will compute a relevance score for each document that specifies how well a document matches the query
    sort = projection;
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if (tagId) {
    filter.tags = tagId;
  }

  // Note.find({WHAT YOU'RE LOOKING FOR}, {WHAT TO RETURN});

  return Note.find(filter, projection)
    .select('id title content folderId tags created')
    .populate('tags')
    .sort(sort)

    .then(results => {
      res.json(results);
    })
    .catch(next);

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
    .select('id title content folderId tags created')
    .populate('tags')
    .then(result => {
      res.status(200).json(result);
    })
    .catch(next);
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/notes', (req, res, next) => {

// const noteTitle = req.params.title;
// const noteContent = req.params.content;

  const { tags } = req.body;

  tags.forEach(tag => {
    if (!mongoose.Types.ObjectId.isValid(tag)) {
      const error = new Error('The tag `id` is not valid');
      error.status = 400;
      return next(error);
    }
  });

  Note
    .create({
      title: req.body.title,
      content: req.body.content,
      folderId: req.body.folderId,
      tags: req.body.tags
    })
    // .select('id title content folderId created')
    .then (result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(next);

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  tags.forEach(tag => {
    if (!mongoose.Types.ObjectId.isValid(tag)) {
      const error = new Error('The tag `id` is not valid');
      error.status = 400;
      return next(error);
    }
  });

  const updateItem = { title, content, folderId, tags };
  const options = { new: true };

  Note.findByIdAndUpdate(id, updateItem, options)
    .select('id title content folderId tags')
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/notes/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  Note
    .findByIdAndRemove(req.params.id)
    .then (() => {
      res.status(204).end();
    })
    .catch(next);
});

module.exports = router;