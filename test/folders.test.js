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


const seedFolders = require('../db/seed/folders');
const Folder = require('../models/folder');

/*         MOCHA HOOKS            */
describe('hooks', function () {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { autoIndex: false }); // disable indexing for tests!
  });

  beforeEach(function() {
    return Folder.insertMany(seedFolders)
      .then(() => Folder.createIndexes());
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });



  /*         GET ALL FOLDERS           */
  describe('GET /v3/folders', function () {

    it('should return the correct number of folders', function () {
      const dbPromise = Folder.find();
      const apiPromise = chai.request(app).get('/v3/folders');

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });



}); // END OF MOCHA HOOK