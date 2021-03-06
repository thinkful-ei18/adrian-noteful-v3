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
const jwt = require('jsonwebtoken');
const { JWT_SECRET} = require('../config');


const User = require('../models/user');
const fullname = 'Example User';
const username = 'exampleUser';
const password = 'examplePass';
let id;


before(function () {
  return mongoose.connect(TEST_MONGODB_URI, { autoIndex: false }); // disable indexing for tests!
});

beforeEach(function() {
  return User.hashPassword(password)
    .then(password => User.create({ username, password, fullname }))
    .then(user => {
      id = user.id;
    });
});

afterEach(function () {
  return User.remove({});
});

after(function () {
  return mongoose.disconnect();
});

describe('Local Auth Test', function () {


  it('Should return a valid auth token', function () {

    return chai.request(app)
      .post('/v3/login')
      .send({ username, password })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        const token = res.body.authToken;
        expect(token).to.be.a('string');
        const payload = jwt.verify(token, JWT_SECRET, { algorithm: ['HS256'] });
        expect(payload.user.username).to.equal( username );
        expect(payload.user.fullname).to.equal( fullname );
        expect(payload.user.id).to.equal( id.toString() );
      });
  });




}); // END OF LOCAL AUTH TESTS