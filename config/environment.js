var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    port: 3000,
    db: 'acomtags_development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    port: 3000,
    db: 'acomtags_test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    port: 3000,
    db: 'acomtags'
  }
};

module.exports = config[env];
