module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const conn = app.mongooseDB.get('book');

    const bookListSchema = new Schema({
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
            type: String
        },
        url: {
            type: String
        },
        imgUrl: {
            type: String
        },
        chapterUrl: {
            type: String
        }
    });

    return conn.model('BookList', bookListSchema);
}