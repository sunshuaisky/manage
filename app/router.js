'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  //框架
  router.get('/', controller.home.index);
  router.get('/jietu', controller.home.jietu);

  //用户管理
  router.post('/api/login', controller.users.login);
  router.post('/api/register', controller.users.register);
  router.get('/api/logout', controller.users.logout);
  router.get('/api/isLogin', controller.users.isLogin);

  //书籍管理
  router.get('/bookList', controller.book.bookList);
  router.get('/bookDetail', controller.book.bookDetail);
};
