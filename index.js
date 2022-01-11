#!/usr/bin/env node
const inquirer = require('inquirer');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const figlet = require('figlet');
const cluster = require("cluster")
const os = require("os")
// /usr/bin/google-chrome-stable
const log = console.log;
const DELAY_TIME = 500
let counter = 0
figlet('HT Live Test!', function(err, data) {
  if (err) {
    log('Something went wrong...');
      console.dir(err);
      return;
  }
  log(data)
});
log(chalk.red.bold("tip:直播间最终人数为开启的进程数*标签数,结束进程可以按ctrl+c退出"));
process.setMaxListeners(0)
setTimeout(() => {
  const prompList = [{ 
    type:'input',
    message:chalk.rgb(0, 204, 255)('请输入开启的浏览器进程数,默认为10'),
    name:'process',
    default:10,
    validate(val) {
      if (val == 0) {
        return "不可以为0"
      }
      return true
    }
  },{
    type:'input',
    message:chalk.rgb(0, 204, 255)('请输入每个浏览器进程的标签页数,默认为10'),
    name:'tab',
    default:10,
    validate(val) {
      if (val == 0) {
        return "不可以为0"
      }
      return true
    }
  },{
    type:'input',
    message:chalk.rgb(0, 204, 255)('请输入直播间完整地址'),
    name:'url',
    default:"https://qtest.hellotalk8.com/h5live/v1/htlive/Y9lLdE9j?hidebar=1",
    validate(val) {
      const rules = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
      if (!rules.test(val)) {
        return "地址格式错误"
      } 
      return true
    }
  }]
  inquirer.prompt(prompList).then(async answers=>{
    log(chalk.red.bold(`正在启动...直播间人数增加${answers.process*answers.tab}`));
    /**
     * answers.process = 进程数
     * answers.tab = 每个进程的tab数量
     * answers.url = 直播间地址
     * 
     */
    // const task = []
    // for (let i = 0; i < toNumber(answers.process); i++) {
    //   task.push(async () => {
    //     const browser = await puppeteer.launch({
    //       // 是否以无界面模式启动
    //       headless:false
    //     });
    //     // 无痕模式
    //     const context = await browser.createIncognitoBrowserContext();
    //     for (let j = 0; j < toNumber(answers.tab); j++) {
    //       const page = await context.newPage();
    //       await page.setDefaultNavigationTimeout(0);
    //       page.goto(answers.url);
    //     }
    //   })
    // }
    // task.forEach((cb) => cb())
    
    // const task = []
    // if (cluster.isMaster) {
    //   const cpus = os.cpus().length
    //   for (let i = 0; i < cpus; i++) {
    //       cluster.fork()
    //   }
    //   cluster.on("exit", (worker, code, signal) => {
    //       console.log("工作进程" + worker.process.pid + "已退出")
    //   })
    // } else {
      let browser = await puppeteer.launch({
        userDataDir: './cache',
        // 是否以无界面模式启动
        headless:true,
        devtools:false,
        // executablePath:"/usr/bin/google-chrome-stable",
        args: [
          '--disable-accelerated-2d-canvas',
          '--autoplay-policy=user-gesture-required',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-client-side-phishing-detection',
          '--disable-component-update',
          '--disable-default-apps',
          '--disable-dev-shm-usage',
          '--disable-domain-reliability',
          '--disable-extensions',
          '--disable-features=AudioServiceOutOfProcess',
          '--disable-hang-monitor',
          '--disable-ipc-flooding-protection',
          '--disable-notifications',
          '--disable-offer-store-unmasked-wallet-cards',
          '--disable-popup-blocking',
          '--disable-print-preview',
          '--disable-prompt-on-repost',
          '--disable-renderer-backgrounding',
          '--disable-setuid-sandbox',
          '--disable-speech-api',
          '--disable-sync',
          '--hide-scrollbars',
          '--ignore-gpu-blacklist',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-first-run',
          '--no-pings',
          '--no-sandbox',
          '--no-zygote',
          '--password-store=basic',
          '--use-gl=swiftshader',
          '--use-mock-keychain',
          /*************************** */
          '--autoplay-policy=user-gesture-required',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-breakpad',
          '--disable-client-side-phishing-detection',
          '--disable-component-update',
          '--disable-default-apps',
          '--disable-dev-shm-usage',
          '--disable-domain-reliability',
          '--disable-extensions',
          '--disable-features=AudioServiceOutOfProcess',
          '--disable-hang-monitor',
          '--disable-ipc-flooding-protection',
          '--disable-notifications',
          '--disable-offer-store-unmasked-wallet-cards',
          '--disable-popup-blocking',
          '--disable-print-preview',
          '--disable-prompt-on-repost',
          '--disable-renderer-backgrounding',
          '--disable-setuid-sandbox',
          '--disable-speech-api',
          '--disable-sync',
          '--hide-scrollbars',
          '--ignore-gpu-blacklist',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-first-run',
          '--no-pings',
          '--no-sandbox',
          '--no-zygote',
          '--password-store=basic',
          '--use-gl=swiftshader',
          '--use-mock-keychain',
          /************************** */
          '--disable-gpu', // GPU硬件加速
          '--disable-dev-shm-usage', // 创建临时文件共享内存
          '--disable-setuid-sandbox', // uid沙盒
          '--no-first-run', // 没有设置首页。在启动的时候，就会打开一个空白页面。
          '--no-sandbox', // 沙盒模式
          '--no-zygote',
          '--disable-extensions',
          // '--single-process', // 单进程运行
        ]
      });
      const browserWSEndpoint = browser.wsEndpoint();
      for (let i = 0; i < toNumber(answers.process); i++) {
        browser = await puppeteer.connect({
          browserWSEndpoint,
        });
          // 无痕模式
          const context = await browser.createIncognitoBrowserContext();
          for (let j = 0; j < toNumber(answers.tab); j++) {
            const page = await context.newPage();
            await page.setDefaultNavigationTimeout(0);

            await page.goto(answers.url);
            await page.setRequestInterception(true)

            await page.on('request', (request) => {
              // request.resourceType() == 'stylesheet' ||
              if ( request.resourceType() == 'font' || request.resourceType() == 'image' ) {
                request.abort()
              } else {
                request.continue()
              }
            })
            // 隐藏页面
            await page.addStyleTag({content: 'html{display: none}'})
            // 阻止css资源加载
            // 点击开始
            // await page.tap("form[class='password-form'] > button[type='submit']");
            counter++;
            console.log(chalk.rgb(0, 204, 255)(`已经增加${counter}...`))
          }
      }

    // }
    // task.forEach((cb) => cb())
  });
},DELAY_TIME)

function toNumber(val) {
  return parseInt(val)
}