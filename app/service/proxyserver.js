const puppeteer = require('puppeteer')

//max retry times
const MAX_RT = 3;

function getproxylist() {

    return new Promise(async (resolve, reject) => {

        var tempbrowser;
        for (var i = MAX_RT; i > 0; i--) {

            if (tempbrowser) {
                break;
            }

            console.log('start to init browser...');
            tempbrowser = await puppeteer.launch({
                headless: true
            }).catch(ex => {
                if (i - 1 > 0) {
                    console.log('browser launch failed. now retry...');
                } else {
                    console.log('browser launch failed!');
                }

            });
        }

        if (!tempbrowser) {
            reject('fail to launch browser');
            return;
        }
        const browser = tempbrowser;

        console.log('start to new page...');
        var page = await browser.newPage().catch(ex => {
            console.log(ex);
        });
        if (!page) {
            reject('fail to open page!');
            return;
        }

        var respond;
        for (var i = MAX_RT; i > 0; i--) {

            if (respond) {
                break;
            }

            console.log('start to goto page...');
            respond = await page.goto("http://31f.cn/http-proxy/", {
                'waitUntil': 'domcontentloaded',
                'timeout': 120000
            }).catch(ex => {
                if (i - 1 > 0) {
                    console.log('fail to goto website. now retry...');
                } else {
                    console.log('fail to goto website!');
                }

            });
        }
        if (!respond) {
            reject('fail to go to website!');
            return;
        }

        console.log('start to find element in page...');
        var layoutVisible = await page.waitForSelector('.container .table-striped tbody').catch(ex => {
            console.log("oh....no...!!!, i can not see anything!!!");
        });
        if (!layoutVisible) {
            reject('layout is invisible!');
            return;
        }
        console.log('start to get info from element...');
        var proxyModelArray = await page.evaluate(async () => {

            let list = document.querySelectorAll('.container .table-striped tbody tr');
            if (!list) {
                return;
            }
            let result = [];

            for (var i = 1; i < list.length; i++) {
                var row = list[i];
                var cells = row.cells;

                var ip = cells[1].textContent;
                var port = cells[2].textContent;

                var proxyServerModel = {
                    'ip': ip,
                    'port': port,
                }
                result.push(proxyServerModel);
            }
            return result;

        });

        await browser.close().catch(ex => {
            console.log('fail to close the browser!');
        });
        console.log('close the browser');

        //console.log(proxyModelArray);
        if (!proxyModelArray || proxyModelArray.length === 0) {
            reject();
            return;
        }
        resolve(proxyModelArray);


    })
}

module.exports = getproxylist;