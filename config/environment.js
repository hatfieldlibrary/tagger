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
        db: 'acomtags_development',
        user: 'mspalti',
        password: 'coffee',
        host: 'localhost',
        sync: { force: false },
        nodeEnv: env
    },

    test: {
        root: rootPath,
        app: {
            name: 'acomtags'
        },
        port: 3000,
        db: 'acomtags_test',
        user: 'mspalti',
        password: 'coffee',
        host: 'localhost',
        sync: { force: true },
        nodeEnv: env
    },

    production: {
        root: rootPath,
        app: {
            name: 'acomtags'
        },
        port: 3000,
        db: 'acomtags',
        user: 'tagger',
        password: 'c0fFee12',
        host: 'libdb.willamette.edu',
        sync: { force: false },
        nodeEnv: env
    }
};

module.exports = config[env];
