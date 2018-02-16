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


const seedTags = require('../db/seed/tags');
const Tag = require('../models/tag');

/*         MOCHA HOOKS            */
describe('hooks', function () {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { autoIndex: false }); // disable indexing for tests!
  });

  beforeEach(function() {
    return Tag.insertMany(seedTags)
      .then(() => Tag.createIndexes());
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });








});