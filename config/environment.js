var path = require('path'),
  rootPath = path.normalize(__dirname + '/../app' ),
  env = process.env.NODE_ENV || 'development';

var config = {

  development: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: 'mspalti',
    gid: 'staff',
    port: 3000,
    mysql: {
      db: 'acomtags_development',
      user: 'mspalti',
      password: 'coffee',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    sync: { force: false },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/usr/local/taggerImages',
    adminPath: '/views',
    modulePath: '/public/modules/acom/app',
    resourcePath: '/public/modules/acom/app',
    googleClientId: '85240803633-enf8ou7eg3cvu77c7qv6ns86v733mse2.apps.googleusercontent.com',
    googleClientSecret: 'x9zgRgnwRJaSk_r8LlQX2Lji',
    googleCallback: 'http://localhost:3000/auth/google/callback',
    nodeEnv: env
  },

  runlocal: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: 'mspalti',
    gid: 'staff',
    port: 3000,
    mysql: {
      db: 'acomtags_development',
      user: 'mspalti',
      password: 'coffee',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    sync: { force: false },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/usr/local/taggerImages',
    adminPath: '/views',
    googleClientId: '85240803633-enf8ou7eg3cvu77c7qv6ns86v733mse2.apps.googleusercontent.com',
    googleClientSecret: 'x9zgRgnwRJaSk_r8LlQX2Lji',
    googleCallback: 'http://localhost:3000/auth/google/callback',
    nodeEnv: env
  },

  test: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: 'mspalti',
    gid: 'staff',
    port: 3000,
    mysql: {
      db: 'acomtags_test',
      user: 'mspalti',
      password: 'coffee',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    sync: { force: true },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/var/taggerImages',
    adminPath: '/views',
    googleClientId: '85240803633-enf8ou7eg3cvu77c7qv6ns86v733mse2.apps.googleusercontent.com',
    googleClientSecret: 'x9zgRgnwRJaSk_r8LlQX2Lji',
    googleCallback: 'http://localhost:3000/auth/google/callback',
    nodeEnv: env
  },

  production: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    sync: { force: false },
    uid: 'node',
    gid: 'node',
    port: 3000,
    redisPort: 6379,
    mysql: {
      db: 'acomtags',
      user: 'tagger',
      password: 'c0fFee12',
      host: 'libdb.willamette.edu',
      port: 3306,
      dialect: 'mariadb'
    },
    convert: '/usr/bin/convert',
    identify: '/usr/bin/identify',
    taggerImageDir: '/var/taggerImages',
    adminPath: '/views',
    googleClientId: '85240803633-enf8ou7eg3cvu77c7qv6ns86v733mse2.apps.googleusercontent.com',
    googleClientSecret: 'x9zgRgnwRJaSk_r8LlQX2Lji',
    googleCallback: 'http://libapps.willamette.edu:3000/auth/google/callback',
    nodeEnv: env
  }
};

module.exports = config[env];
