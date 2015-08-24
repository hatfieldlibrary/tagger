var path = require('path'),
  rootPath = path.normalize(__dirname + '/../app' ),
  env = process.env.NODE_ENV || 'development';

var config = {

  development: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: 'your-uid',
    gid: 'your-gid',
    port: 3000,
    mysql: {
      db: 'acomtags_development',
      user: 'username',
      password: 'userpassword',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/usr/local/taggerImages',
    modulePath: '/public/modules/acom/app',
    resourcePath: '/public/modules/acom/app',
    googleClientId: 'google-client-id-here',
    googleClientSecret: 'google-client-secret-here',
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
      user: 'user-name',
      password: 'password',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/usr/local/taggerImages',
    modulePath: '/public/modules/acom/dist',
    resourcePath: '/public/modules/acom/dist',
    googleClientId: 'google-client-id-here',
    googleClientSecret: 'google-client-secret-here',
    googleCallback: 'http://localhost:3000/auth/google/callback',
    nodeEnv: env
  },

  test: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: 'your-uid',
    gid: 'your-gid',
    port: 3000,
    mysql: {
      db: 'acomtags_test',
      user: 'user-name',
      password: 'password',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql'
    },
    convert: '/usr/local/bin/convert',
    identify: '/usr/local/bin/identify',
    taggerImageDir: '/var/taggerImages',
    modulePath: '/public/modules/acom/app',
    resourcePath: '/public/modules/acom/app',
    googleClientId: 'google-client-id-here',
    googleClientSecret: 'google-client-secret-here',
    googleCallback: 'http://localhost:3000/auth/google/callback',
    nodeEnv: env
  },

  production: {
    root: rootPath,
    app: {
      name: 'acomtags'
    },
    uid: 'node',
    gid: 'node',
    port: 3001,
    redisPort: 6379,
    mysql: {
      db: 'acomtags2',
      user: 'user-name',
      password: 'password',
      host: 'database.host.edu',
      port: 3306,
      dialect: 'mariadb'
    },
    convert: '/usr/bin/convert',
    identify: '/usr/bin/identify',
    taggerImageDir: '/var/taggerImages',
    modulePath: '/public/modules/acom2/dist',
    resourcePath: '/public/modules/acom2/dist',
    googleClientId: 'google-client-id-here',
    googleClientSecret: 'google-client-secret-here',
    googleCallback: 'http://your.host.edu:3000/auth/google/callback',
    nodeEnv: env
  }
};

module.exports = config[env];
