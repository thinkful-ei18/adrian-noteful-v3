'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Folder = require('../models/folder');
const Note = require('../models/note');


router.get('/folders', (req, res, next) => {
  const userId = req.user.id;

  return Folder
    .find({ userId })
    .select('id name userId')
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(next);

});

router.get('/folders/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  return Folder
    .findOne({_id: id, userId})
    .select('id name userId')
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

router.post('/folders', (req, res, next) => {
  const { name } = req.body;
  // const { id } = req.params;
  const userId = req.user.id;

  const newFolder = { name, userId };

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Folder
    .create(newFolder)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The `folder` name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/folders/:id', (req, res, next) => {

  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
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

  const updateItem = { name };
  const options = { new: true };

  Folder
    .findByIdAndUpdate({_id: id, userId}, updateItem, options)
    .select('id name')
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The `folder` name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/folders/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const error = new Error('The `id` is not valid');
    error.status = 400;
    return next(error);
  }

  const deleteFolder = Folder.findByIdAndRemove({_id: id, userId});
  // const deleteNotes = Note.deleteMany({folderId: id, userId});
  const resetFolderId = Note.update({folderId: id, userId}, {$set: {folderId: null}});


  Promise.all([deleteFolder, resetFolderId])
    .then(folderResult => {
      // console.log(folderResult);
      const result = folderResult[0];
      if(result){
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(next);

});



module.exports = router;