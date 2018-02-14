'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');
const expect = chai.expect;

chai.use(chaiHttp);
chai.use(chaiSpies);

const mongoose = require('mongoose');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const seedData = require('../db/seed/notes');

// console.log(seedData);

/*         MOCHA HOOKS            */
describe('hooks', function () {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { autoIndex: false }); // disable indexing for tests!
  });

  beforeEach(function() {
    return Note.insertMany(seedData)
      .then(() => Note.ensureIndexes());
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  /*         ROUTER TESTS            */

  // GET ALL NOTES
  // Expect: an array of objects, 200 status, json object, compare API results to database results
  // Edge case: test a bad path, expect a 404 error

  describe('GET /v3/notes/:id', function () {

  });

});