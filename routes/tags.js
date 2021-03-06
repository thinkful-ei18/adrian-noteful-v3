'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Tag = require('../models/tag');
const Note = require('../models/note');

router.get('/tags', function (req, res, next) {
  const userId = req.user.id;

  return Tag
    .find({ userId })
    .select('name')
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(next);
});

router.get('/tags/:id', function (req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  return Tag
    .findById({_id: id, userId})
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
  const userId = req.user.id;
  const newTag = { name, userId };


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

router.delete('/tags/:id', function (req, res, next) {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  const deleteTag = Tag.findByIdAndRemove({_id: id, userId});
  // const deleteNotes = Note.deleteMany({folderId: req.params.id});
  const resetTagId = Note.update({ $pull: { tags: {$in: [id, userId] } } });

  Promise.all([deleteTag, resetTagId])
    .then(tagResult => {
      // console.log(folderResult);
      const result = tagResult[0];
      if(result){
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);

});



module.exports = router;