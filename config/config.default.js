'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1545117524319_9146';

  // use mongodb
  config.mongoose = {
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
      ignoreJSON: true,
    },
    domainWhiteList: [ 'http://10.100.3.99:8000' ],
  };

  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    // origin: () => ['http://192.168.1.76:8000', 'http://192.168.1.76:8989']//这边不能为*号，需要指定明确的、与请求网页一致的域名
  };

  config.session = {
    key: 'USER_INFO', // key名字
    maxAge: 1,
    httpOnly: true,
    encrypt: true, // 加密
    renew: false, // 最大时间范围内，刷新，自动增加最大时间
  };

  return config;
};
