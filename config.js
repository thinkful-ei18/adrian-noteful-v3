'use strict';

// for testing only!
exports.TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost/noteful-app-test';

// for production use
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/noteful-app';

exports.PORT = process.env.PORT || 8080;
