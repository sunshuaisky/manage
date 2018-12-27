'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1545117524319_9146';

  //use mongodb
  exports.mongoose = {
    clients: {
      // clientId, access the client instance by app.mongooseDB.get('clientId')
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

  // add your config here
  config.middleware = [];

  return config;
};
