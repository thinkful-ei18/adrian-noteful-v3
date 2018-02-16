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

});




module.exports = router;