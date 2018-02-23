'use strict';

const fullname = 'Example User';
const username = 'exampleUser';
const password = 'examplePass';

const User = require('../models/user');

beforeEach(function() {
  return User.hashPassword(password)
    .then(password => User.create({ username, password, fullname }));
});

afterEach(function () {
  return User.remove({});
});