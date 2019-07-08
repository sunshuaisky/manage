'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const conn = app.mongooseDB.get('user');

  const UsersSchema = new Schema({
    userName: {
      type: String,
    },
    passWord: {
      type: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    phoneNum: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  });
  return conn.model('Users', UsersSchema);
};
