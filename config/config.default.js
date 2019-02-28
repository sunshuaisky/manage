'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1545117524319_9146';

  //use mongodb
  exports.mongoose = {
    clients: {
      // clientId, access the client instance by app.mongooseDB.get('clientId')
      user: {
        url: 'mongodb://127.0.0.1/user',
        options: {},
      },
      book: {
        url: 'mongodb://127.0.0.1/book',
        options: {},
      },
      pokemon: {
        url: 'mongodb://127.0.0.1/pokemon',
        options: {},
      },
    },
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  exports.session = {
    renew: true,
  };
  
  // add your config here
  config.middleware = [];

  return config;
};