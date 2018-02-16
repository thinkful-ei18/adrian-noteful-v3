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
const seedNotes = require('../db/seed/notes');
const seedFolders = require('../db/seed/folders');
const Folder = require('../models/folder');

// console.log(seedData);

/*         MOCHA HOOKS            */
describe('hooks', function () {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { autoIndex: false }); // disable indexing for tests!
  });

  beforeEach(function() {
    const noteInsertPromise = Note.insertMany(seedNotes);
    const folderInsertPromise = Folder.insertMany(seedFolders);
    return Promise.all([noteInsertPromise, folderInsertPromise])
      .then(() => Note.createIndexes());
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  /*         ROUTER TESTS            */

  /*         GET ALL NOTES           */
  describe('GET /v3/notes', function () {

    it('should return the correct number of Notes', function () {
      // 1) Call the database and the API
      const dbPromise = Note.find();
      const apiPromise = chai.request(app).get('/v3/notes');

      // 2) Wait for both promises to resolve using `Promise.all`
      return Promise.all([dbPromise, apiPromise])
      // 3) **then** compare database results to API response
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return the correct search results for a searchTerm query', function () {
      const term = 'gaga';
      const dbPromise = Note.find(
        { $text: { $search: term, $language: 'none'} },
        { score: { $meta: 'textScore'} })
        .sort( {score: {$meta: 'textScore'} });

      const apiPromise = chai.request(app).get(`/v3/notes?searchTerm=${term}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0].id).to.equal(data[0].id);
        });
    });

    it('should return correct search results for a folderId query', function () {
      let data;
      return Folder.findOne().select('id name')
        .then((_data) => {
          data = _data;
          const dbPromise = Note.find({ folderId: data.id });
          const apiPromise = chai.request(app).get(`/v3/notes?folderId=${data.id}`);
          return Promise.all([dbPromise, apiPromise]);
        })
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });


  }); // end of GET /v3/notes tests

  /*         GET NOTE BY ID           */
  describe('GET /v3/notes/:id', function () {

    it('should return correct notes', function () {
      let data;
      // 1) First, call the database
      return Note.findOne().select('id title content')
        .then(_data => {
          data = _data;
          // 2) **then** call the API
          return chai.request(app).get(`/v3/notes/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'folderId', 'tags', 'created');

          // 3) **then** compare
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
        });
    });

    it('should respond with a 400 for improperly formatted id', function () {
      const badId = '99-99-99';
      const spy = chai.spy();
      return chai.request(app)
        .get(`/v3/notes/${badId}`)
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

  }); //END OF GET NOTES BY ID TESTS

  /*         CREATE A NOTE           */
  describe('POST /v3/notes', function () {
    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'title': 'The best article about cats ever!',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
        'tags': []
      };
      let body;
      // 1) First, call the API
      return chai.request(app)
        .post('/v3/notes')
        .send(newItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('id', 'title', 'content');
          // 2) **then** call the database
          return Note.findById(body.id);
        })
      // 3) **then** compare
        .then(data => {
          expect(body.title).to.equal(data.title);
          expect(body.content).to.equal(data.content);
        });
    });
  }); // END OF POST NOTE TESTS


  /*         MODIFY A NOTE           */
  describe('PUT /v3/notes', function () {
    it('should modify title and content of a note', function () {

      const id = '000000000000000000000000';
      const updateItem = {title: 'Brand new day!', content: 'Brand new cat!', tags: ['222222222222222222222200']};
      const options = { new: true };
      let body;

      return chai.request(app)
        .put(`/v3/notes/${id}`)
        .send(updateItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.include.keys('id', 'title', 'content');
          return Note.findByIdAndUpdate(id, updateItem, options);
        })
        .then(data => {
          expect(body.id).to.equal(data.id);
          expect(body.title).to.equal(data.title);
          expect(body.content).to.equal(data.content);
        });
    });


    it('should validate input for a note title', function () {

      const id = '000000000000000000000000';
      const updateItem = {content: 'Brand new cat!'};
      const options = { new: true };
      let body;

      return chai.request(app)
        .put(`/v3/notes/${id}`)
        .send(updateItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.be.null;
          expect.res.body.should.have.property('error');
          return Note.findByIdAndUpdate(id, updateItem, options);
        })
        .then(data => {
          body = data.body;
          expect(data).to.be.null;
          expect.data.body.should.have.property('error');
        })
        .catch(err => {
          const res = err.response;
          expect(res).to.have.property('error');
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('Missing `title` in request body');
        });




    });


  }); // end of PUT

  /*         DELETE A NOTE           */
  describe('DELETE /v3/notes', function () {
    it('should permanently delete an item', function () {
      return chai.request(app)
        .delete('/v3/notes/000000000000000000000001')
        .then(function (res) {
          expect(res).to.have.status(204);
          return Note.findById('000000000000000000000001');
        })
        .then(data => {
          expect(data).to.be.null;
        });
    });

    it('should respond with a 400 for improperly formatted id', function () {
      const badId = '99-99-99';
      const spy = chai.spy();
      return chai.request(app)
        .delete(`/v3/notes/${badId}`)
        .then(spy)
        .then(() => {
          expect(spy).to.not.have.been.called();
        })
        .catch(err => {
          const res = err.response;
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });

  }); // END OF DELETE

}); // END OF MOCHA HOOK