'use strict';

const fullname = 'Example User';
const username = 'exampleUser';
const password = 'examplePass';

const mongoose = require('mongoose');
const { TEST_MONGODB_URI } = require('../config');
const User = require('../models/user');

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