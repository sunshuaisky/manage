'use strict';

const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }
  async jietu() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    await page.screenshot({ path: 'example.png' });
    await browser.close();
  }
}

module.exports = HomeController;
