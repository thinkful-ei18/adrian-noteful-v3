'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {MONGODB_URI} = require('../config');

const Note = require('../models/note');