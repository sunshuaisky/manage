'use strict';

const Service = require('egg').Service;

class BookService extends Service {
    async createBook(data) {
        const book = new this.ctx.model.BookList(data);
        book.save();
    }

    async updateBook(bid, data) {
        await this.ctx.model.BookList.update({
            bid: bid
        }, data);
    }
}
module.exports = BookService;