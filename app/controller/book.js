'use strict';

const Controller = require('egg').Controller;
const puppeteer = require('puppeteer');
const fs = require('fs')
const path = require('path')

const types = ['奇幻玄幻', '武侠修真', '言情都市', '历史穿越', '游戏竞技', '异灵科幻'];

class BookController extends Controller {
    async bookList() {
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
            await page.goto('http://www.37zw.net/xiaoshuodaquan/');

            // 等待页面请求完成
            const result = await page.evaluate(() => {
                let types = document.querySelectorAll("#main .novellist");
                let arr = [];
                types.forEach((item, index) => {
                    let typeIndex = index;
                    let lis = item.querySelectorAll("ul li");
                    lis.forEach((item, index) => {
                        let bookIndex = index;
                        let data = {
                            type: typeIndex,
                            title: item.querySelector("a").innerText,
                            author: item.innerHTML.split('/')[5],
                            bid: item.innerHTML.split('/')[2],
                            url: item.querySelector("a").href
                        }
                        //存入数据库
                        // XXXXXXXXXX

                        arr.push(data);
                    })
                })
                return arr;
            });
            fs.writeFile('app/public/book/bookList.json', JSON.stringify(result), function (err) {
                if (err) {
                    logger.info(err);
                }
            });
            // for (var i = 0; i < result.length; i++) {
            //     await page.goto(result[i].url);
            //     console.log('进入详情页。。。')
            //     const intro = await page.evaluate(() => {
            //         let intro = document.querySelector("#intro p").innerText;
            //         return intro;
            //     })
            //     result[i]['intro'] = intro;
            //     console.log(result);
            // }
        } catch (error) {
            console.log(error);
        }
    }

    async bookDetail() {
        const data = JSON.parse(fs.readFileSync('app/public/book/bookList.json', 'utf-8'))[0];
        const browser = await puppeteer.launch({
            headless: true,
            // args: [
            //     '--proxy-server=socks5://127.0.0.1:7001'
            // ]
        });
        const page = await browser.newPage();
        await page.goto(data.url);
        console.log('进入详情页。。。')
        const result = await page.evaluate(() => {
            let chapters = [];
            let intro = document.querySelector("#intro p").innerText;
            let imgUrl = document.querySelector("#fmimg img").getAttribute("src");
            let chapter = document.querySelectorAll("#list dl dd");

            //存入数据库
            // data['intro'] = intro;
            // data['imgUrl'] = imgUrl;

            chapter.forEach(item => {
                let data = {
                    chapterTitle: item.querySelector("a").innerText,
                    chapterUrl: item.querySelector("a").href
                }
                chapters.push(data);
            })
            return chapters;
        })
        for (let i = 0; i < result.length; i++) {
            await page.goto(result[i].chapterUrl);
            console.log('进入文章。。。')
            const content = await page.evaluate(() => {
                let content = document.querySelector("#content").innerText;
                return content;
            })
            // result[i]['content'] = content;
            console.log(content);
        }
    }

}

module.exports = BookController;