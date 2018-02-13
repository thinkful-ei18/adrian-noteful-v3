'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { MONGODB.URI } = require('../config');
const Note = require('../models/note');

const seedNotes = require('../db/seed/notes');