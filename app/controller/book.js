'use strict';

const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');
const fs = require('fs')

const types = ['玄幻魔法', '武侠修真', '现代都市', '言情小说', '历史军事', '游戏竞技', '科幻灵异', '耽美小说', '同人小说', '其他小说'];

class BookController extends Controller {
    async bookList() {
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
            console.log('准备进入大全页面')
            console.log('进入中。。。')

            //进入页面
            await page.goto('http://www.uu234.net/all/');

            // 等待页面请求完成
            const result = await page.evaluate(() => {
                let types = document.querySelectorAll(".authorlistl .aubook2");
                let arr = [];
                types.forEach((item, index) => {
                    let typeIndex = index;
                    let lis = item.querySelectorAll("h4");
                    lis.forEach((item, index) => {
                        let data = {
                            type: typeIndex,
                            title: item.querySelector("a").innerText,
                            author: item.innerHTML.split('/')[6],
                            bid: item.innerHTML.split('/')[3],
                            url: item.querySelector("a").href,
                            isDetail: false,
                            chapterNum: 0
                        }
                        arr.push(data);
                    })
                })
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
        const data = JSON.parse(fs.readFileSync('app/public/book/bookList.json', 'utf-8'));
        const browser = await puppeteer.launch({
            headless: true,
            // args: [
            //     '--proxy-server=socks5://127.0.0.1:7001'
            // ]
        });
        const page = await browser.newPage();
        try {
            for (let i = 0; i < data.length; i++) {
                if (!data[i].isDetail) {
                    console.log("准备进入。。。")
                    await page.goto(data[i].url);
                    console.log('进入详情页。。。');
                    await page.waitFor(10000);
                    const result = await page.evaluate(() => {
                        let intro = document.querySelector(".r_cons").innerHTML;
                        let imgUrl = document.querySelector(".con_limg img").getAttribute("src");
                        let chapterUrl = document.querySelector(".dirtools a").href;
                        let title = document.querySelector(".r420 h1").innerText;

                        let update = {
                            main: intro,
                            imgUrl: imgUrl,
                            chapterUrl: chapterUrl,
                            title: title,
                            isDetail: true,
                            updateAt: Date.now()
                        }
                        return update;
                    })

                    //存入数据库
                    await ctx.service.book.updateBook(data[i].bid, result);
                    data[i].isDetail = true;
                    fs.writeFileSync('app/public/book/bookList.json', JSON.stringify(data));
                    console.log(`已更新${result.title}`);
                }
            }
        } catch (error) {
            console.log(`err:${error}`);
            await browser.close();
            await this.bookDetail();
        }
    }
}

module.exports = BookController;