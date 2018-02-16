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

    it('should return a 404 bad path', function () {

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


  /*         GET ALL TAGS           */
  describe('GET /v3/tags/:id', function () {

    it('should return correct tag', function () {
      let data;
      // 1) First, call the database
      return Tag.findOne().select('name')
        .then(_data => {
          data = _data;
          // 2) **then** call the API
          return chai.request(app).get(`/v3/tags/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'name');

          // 3) **then** compare
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
        });
    });

    it('should respond with a 400 for improperly formatted id', function () {
      const badId = '99-99-99';
      const spy = chai.spy();

      return chai.request(app)
        .get(`/v3/tags/${badId}`)
        .then(spy)
        .catch(err => {
          const res = err.response;
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        })
        .then(() => {
          expect(spy).to.not.have.been.called();
        });
    });




  }); //END OF GET NOTES BY ID

}); // END OF MOCHA HOOK