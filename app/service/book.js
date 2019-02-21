'use strict';

const Service = require('egg').Service;

class BookService extends Service {
    async createBook(data) {
        const book = new this.ctx.model.BookList(data);
        book.save();
    }

    async updateBook(bid, data) {
        await this.ctx.model.BookList.updateOne({
            bid: bid
        }, data);
    }

    // async timeout(delay) {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             try {
    //                 resolve(1);
    //             } catch (e) {
    //                 reject(0)
    //             }
    //         }, delay);
    //     });
    // }
}
module.exports = BookService;