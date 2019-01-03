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
                            url: item.querySelector("a").href
                        }
                        arr.push(data);
                    })
                })
                return arr;
            });
            for (let i = 0; i < result.length; i++) {
                // (function (j) {
                //     setTimeout(async () => {

                //     }, j * 10000);
                // })(i)
                console.log("准备进入。。。");
                console.log(result[i].url)
                await page.goto(result[i].url);
                // await page.waitForNavigation();
                // await page.waitFor(30000);
                console.log('进入详情页。。。')
                // await page.evaluate(() => {
                //     let intro = document.querySelector(".r_cons").innerHTML;
                //     let imgUrl = document.querySelector(".con_limg img").getAttribute("src");
                //     let chapterUrl = document.querySelector(".dirtools a").href;
                //     result[i]['main'] = intro;
                //     result[i]['imgUrl'] = imgUrl;
                //     result[i]['chapterUrl'] = chapterUrl;
                //     console.log(result[i])
                // })
                console.log(result[i])
                // //存入数据库
                // console.log(result[j])
                // await ctx.service.book.createBook(result[j]);
            }
            fs.writeFile('app/public/book/bookList.json', JSON.stringify(result), function (err) {
                if (err) {
                    logger.info(err);
                }
            });
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

        for (let i = 0; i < data.length; i++) {
            (function (j) {
                setTimeout(async () => {
                    console.log("准备进入。。。")
                    await page.goto(data[i].url);
                    console.log('进入详情页。。。')
                    const result = await page.evaluate(() => {
                        let intro = document.querySelector(".r_cons").innerHTML;
                        let imgUrl = document.querySelector(".con_limg img").getAttribute("src");
                        let chapterUrl = document.querySelector(".dirtools a").href;

                        let update = {
                            main: intro,
                            imgUrl: imgUrl,
                            chapterUrl: chapterUrl
                        }
                        return update;
                    })

                    //存入数据库
                    await ctx.service.book.updateBook(data[i].bid, result);
                }, j * 10000);
            })(i)
        }

    }

}

module.exports = BookController;