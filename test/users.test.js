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
const User = require('../models/user');

const fullname = 'Example User';
const username = 'exampleUser';
const password = 'examplePass';

before(function () {
  return mongoose.connect(TEST_MONGODB_URI, { autoIndex: false }); // disable indexing for tests!
});

beforeEach(function() {
  return User.hashPassword(password)
    .then(password => User.create({ username, password, fullname }));
});

afterEach(function () {
  return User.remove({});
});

after(function () {
  return mongoose.disconnect();
});

describe('Local Auth Test', function () {

});