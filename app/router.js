'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/jietu', controller.home.jietu);
  router.get('/bookList', controller.book.bookList);
  router.get('/bookDetail', controller.book.bookDetail);
};
