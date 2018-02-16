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


  /*         GET ALL TAGS           */
  describe('GET /v3/tags', function () {

    it('should return the correct number of folders', function () {
      const dbPromise = Tag.find();
      const apiPromise = chai.request(app).get('/v3/tags');

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it.only('should return a 404 bad path', function () {

      const spy = chai.spy();
      return chai.request(app)
        .get('/v3/tagz')
        .then(spy)
        .catch(err => {
          const res = err.response;
          expect(res).to.have.status(404);
          expect(res.body.message).to.eq('Not Found');
        })
        .then(() => {
          expect(spy).to.not.have.been.called();
        });
    });


  }); //END OF GET FOLDERS




}); // END OF MOCHA HOOK