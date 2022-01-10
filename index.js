#!/usr/bin/env node
const inquirer = require('inquirer');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const figlet = require('figlet');
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
    const task = []
    for (let i = 0; i < toNumber(answers.process); i++) {
        const browser = await puppeteer.launch({
          // 是否以无界面模式启动
          headless:true
        });
        // 无痕模式
        const context = await browser.createIncognitoBrowserContext();
        for (let j = 0; j < toNumber(answers.tab); j++) {
          const page = await context.newPage();
          await page.setDefaultNavigationTimeout(0);
          await page.goto(answers.url);
          counter++;
          console.log(chalk.rgb(0, 204, 255)(`已经增加${counter}...`))
        }
    }
    task.forEach((cb) => cb())
  });
},DELAY_TIME)

function toNumber(val) {
  return parseInt(val)
}