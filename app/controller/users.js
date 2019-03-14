'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');
const ms = require('ms');


class UserController extends Controller {
  //登录
  async login() {
    const ctx = this.ctx;
    const {
      userName,
      passWord,
      remember
    } = ctx.request.body;
    //加密
    const md5 = crypto.createHash('md5');
    const end_paw = md5.update(passWord).digest('hex');
    const params = {
      userName: userName,
      passWord: end_paw
    };
    //查询是否存在账户
    const user = await ctx.service.users.login(params);
    if (user) {
      // 设置 Session
      ctx.session.user = user;
      // 如果用户勾选了 `记住我`，设置 30 天的过期时间
      if (remember) ctx.session.maxAge = ms('30d');

      ctx.body = {
        status: 200,
        msg: '登录成功！',
        data: user
      }
    } else {
      ctx.body = {
        status: 401,
        msg: '账号或密码错误！'
      }
    }
  }

  //注册
  async register() {
    const ctx = this.ctx;
    const params = ctx.request.body;
    //加密
    const md5 = crypto.createHash('md5');
    const end_paw = md5.update(params.passWord).digest('hex');
    params.passWord = end_paw;
    // let params = {
    //     userName: 'sunshuaisky',
    //     passWord: end_paw,
    //     avatar: '',
    //     phoneNum: '13678855787',
    //     email: '592989308@qq.com',
    // }
    await ctx.service.users.creatAcount(params);
  }

  async logout() {
    const ctx = this.ctx;
    ctx.session.user = null;
    ctx.body = {
      status: 200,
      msg: '退出登录！'
    }
  }

  async isLogin() {
    const ctx = this.ctx;
    if (!ctx.session.user) {
      ctx.status = 401;
    } else {
      ctx.body = {
        status: 200,
        msg: 'ok！'
      }
    }
  }
}

module.exports = UserController;