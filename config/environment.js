var path = require('path'),
  rootPath = path.normalize(__dirname + '/..' ),
  env = process.env.NODE_ENV || 'development';

var config = {

  development: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    port: 3000,
    redisPort: 6379,
    db: 'acomtags_development',
    user: 'mspalti',
    password: 'coffee',
    uid: 'mspalti',
    gid: 'staff',
    host: 'localhost',
    sync: { force: false },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/usr/local/taggerImages',
    modulePath: '/public/modules/acom/app',
    resourcePath: '/public/modules/acom/dist',
    googleClientId: '85240803633-enf8ou7eg3cvu77c7qv6ns86v733mse2.apps.googleusercontent.com',
    googleClientSecret: 'x9zgRgnwRJaSk_r8LlQX2Lji',
    googleCallback: 'http://localhost:3000/auth/google/callback',
    redis: {
      host: "127.0.0.1",
      port: 3006
    },
    nodeEnv: env
  },

  runlocal: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    port: 3000,
    redisPort: 6379,
    db: 'acomtags_development',
    user: 'mspalti',
    password: 'coffee',
    uid: 'node',
    gid: 'staff',
    host: 'localhost',
    sync: { force: false },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/usr/local/taggerImages',
    modulePath: '/public/modules/acom/dist',
    resourcePath: '/public/modules/acom/dist',
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
    port: 3000,
    redisPort: 6379,
    db: 'acomtags_test',
    user: 'mspalti',
    password: 'coffee',
    uid: 'mspalti',
    gid: 'staff',
    host: 'localhost',
    sync: { force: true },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/var/taggerImages',
    modulePath: '/public/modules/acom/app',
    resourcePath: '/public/modules/acom/dist',
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
    port: 3000,
    redisPort: 6379,
    db: 'acomtags',
    user: 'tagger',
    password: 'c0fFee12',
    uid: 'node',
    gid: 'node',
    host: 'libdb.willamette.edu',
    sync: { force: false },
    convert: '/usr/bin/convert',
    identify: '/usr/bin/identify',
    taggerImageDir: '/var/taggerImages',
    modulePath: '/public/modules/acom/dist',
    resourcePath: '/public/modules/acom/dist',
    googleClientId: '85240803633-rqnjpf9qt2129irc52flfofnu9les0r9.apps.googleusercontent.com',
    googleClientSecret: 'uHqX6CXvjNejGd80bnjiiqD9',
    googleCallback: 'http://libapps.willamette.edu:3000/auth/google/callback',
    nodeEnv: env
  }
};

module.exports = config[env];
