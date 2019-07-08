/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
'use strict';

const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');
const async = require('async');
const fs = require('fs');
// const getproxylist = require('../service/proxyserver');

// const types = [
//   '玄幻魔法',
//   '武侠修真',
//   '现代都市',
//   '言情小说',
//   '历史军事',
//   '游戏竞技',
//   '科幻灵异',
//   '耽美小说',
//   '同人小说',
//   '其他小说',
// ];

// 并发连接数的计数器
let concurrencyCount = 0;
const fetchUrl = async function(data, url, ctx, callback) {
  console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url);
  concurrencyCount++;
  // const random = Math.round(Math.random() * 50);
  // console.log(`http://${proxyList[random].ip}:${proxyList[random].port}`)
  const browser = await puppeteer.launch({
    headless: true,
    // args: [
    //     '--proxy-server=socks5://127.0.0.1:7001'
    // ]
    ignoreHTTPSErrors: true,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
  });
  const page = await browser.newPage();
  console.log('准备进入。。。');
  await page.goto(url, {
    timeout: 60000,
  });
  console.log('进入详情页。。。');
  await page.waitFor(10000);
  const result = await page.evaluate(() => {
    const intro = document.querySelector('.r_cons').innerHTML;
    const imgUrl = document.querySelector('.con_limg img').getAttribute('src');
    const chapterUrl = document.querySelector('.dirtools a').href;
    const title = document.querySelector('.r420 h1').innerText;

    const update = {
      main: intro,
      imgUrl,
      chapterUrl,
      title,
      isDetail: true,
      updateAt: Date.now(),
    };
    return update;
  });

  // 存入数据库
  // console.log(url.split('/')[3])
  // console.log(result)
  await ctx.service.book.updateBook(url.split('/')[3], result);
  let i;
  data.filter((item, index) => {
    if (item.url === url) {
      i = index;
    }
  });
  data[i].isDetail = true;
  fs.writeFileSync('app/public/book/bookList.json', JSON.stringify(data));
  console.log(`已更新${result.title}`);
  browser.close();
  setTimeout(function() {
    concurrencyCount--;
    callback(null, url + ' html content');
  }, 60000);
};
class BookController extends Controller {
  async refreshBookList() {
    const ctx = this.ctx;
    console.log('准备打开浏览器');
    try {
      const browser = await puppeteer.launch({
        headless: true,
        // args: [
        //     '--proxy-server=socks5://127.0.0.1:7001'
        // ]
      });
      const page = await browser.newPage();
      console.log('准备进入大全页面');
      console.log('进入中。。。');

      // 进入页面
      await page.goto('http://www.uu234.net/all/');

      // 等待页面请求完成
      const result = await page.evaluate(() => {
        const types = document.querySelectorAll('.authorlistl .aubook2');
        const arr = [];
        types.forEach((item, index) => {
          const typeIndex = index;
          const lis = item.querySelectorAll('h4');
          lis.forEach((item, index) => {
            const data = {
              type: typeIndex,
              title: item.querySelector('a').innerText,
              author: item.innerHTML.split('/')[6],
              bid: item.innerHTML.split('/')[3],
              url: item.querySelector('a').href,
              isDetail: false,
              chapterNum: 0,
            };
            arr.push(data);
          });
        });
        return arr;
      });
      for (let i = 0; i < result.length; i++) {
        await ctx.service.book.createBook(result[i]);
      }
      fs.writeFileSync('app/public/book/bookList.json', JSON.stringify(result));
      console.log('完成');
    } catch (error) {
      console.log(error);
    }
  }

  async bookDetail() {
    const ctx = this.ctx;
    const data = JSON.parse(
      fs.readFileSync('app/public/book/bookList.json', 'utf-8')
    );

    const urls = [];

    for (let i = 0; i < data.length; i++) {
      if (!data[i].isDetail) {
        // await this.saveDetail(page, browser, data, i, ctx);
        urls.push(data[i].url);
      }
    }
    async.mapLimit(
      urls,
      5,
      function(url, callback) {
        fetchUrl(data, url, ctx, callback);
      },
      function(err, result) {
        console.log(err);
        console.log('final:');
        console.log(result);
      }
    );
  }

  async getBookList() {
    const ctx = this.ctx;
    // const count = await ctx.service.book.bookListCount(ctx.request.body.limit);
    const list = await ctx.service.book.getBookList(ctx.request.body.limit);
    if (list) {
      ctx.body = {
        status: 200,
        msg: '列表获取成功！',
        data: {
          data: list,
          // totalCount: count,
          // currentPage: ctx.request.body.page,
        },
      };
    } else {
      ctx.body = {
        status: 301,
        msg: '列表获取失败！',
        data: null,
      };
    }
  }
}

module.exports = BookController;
