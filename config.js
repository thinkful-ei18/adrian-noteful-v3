'use strict';

module.exports = {
  // for testing only!
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://localhost/noteful-app-test',

  // for production use
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/noteful-app',

  PORT: process.env.PORT || 8080,

  // for JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'

};