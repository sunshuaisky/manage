module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const conn = app.mongooseDB.get('book');

    const bookList = new Schema({
        title: {
            type: String,
            index: true
        },
        lastBlank: {
            type: String
        },
        author: {
            type: String
        },
        lastupdate: {
            type: Date
        },
        type: {
            type: Number
        },
        main: {
            type: String
        },
        bid: {
            type: Number
        },
        imgUrl: {
            type: String
        }
    });

    return conn.model('bookList', bookList);
}