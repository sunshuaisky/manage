'use strict';

const Service = require('egg').Service;

class BookService extends Service {
  async createBook(data) {
    const book = new this.ctx.model.BookList(data);
    book.save();
  }

  async updateBook(bid, data) {
    await this.ctx.model.BookList.updateOne(
      {
        bid,
      },
      data
    );
  }

  async getBookList(limit) {
    return await this.ctx.model.BookList.find(
      limit,
      null,
      // {
      //   skip: (page * 1 - 1) * 15,
      //   limit: 15,
      // },
      function(err, list) {
        if (err) {
          return err;
        }
        return list;
      }
    );
  }

  async bookListCount(limit) {
    return await this.ctx.model.BookList.count(limit);
  }
}
module.exports = BookService;
