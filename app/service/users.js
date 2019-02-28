'use strict';

const Service = require('egg').Service;

class UsersService extends Service {
    async creatAcount(data) {
        const user = new this.ctx.model.Users(data);
        user.save();
    }

    async login(data) {
        return await this.ctx.model.Users.findOne(data, function (err, user) {
            if (err){
                return err;
            }
            return user;
        });
    }
}
module.exports = UsersService;