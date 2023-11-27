const fs = require("fs");
const puppeteer = require("puppeteer");
const BrowserInit = require('./browser');
const ScraperController = require('./controller');

(async () => {


  let browserInstance = await BrowserInit()

  if (browserInstance) {
    ScraperController(browserInstance)
  }

  // const strings = ""

// Đường dẫn tới file notepad
// const duongDanFile = './100acc.txt';

// // Đọc nội dung của file notepad
// fs.readFile(duongDanFile, 'utf8', (err, data) => {
//   if (err) {
//     console.error('Đã xảy ra lỗi khi đọc file:', err);
//     return;
//   }
//   let lines = data.split('\n');

//   lines.forEach((line, index) => {

//     let arr = line.split('|')

//     let add = arr[2] + '|' + arr[0] + '|' + arr[1]+ '|' + arr[3]

//   fs.appendFile(
//              "results.txt",
//              `${add}\n`,
//              function (err) {
//                if (err) throw err;
//              }
//         );
//   // Thực hiện các thao tác xử lý với từng dòng ở đây
// });
//   console.log('Nội dung của file:', data.length);
// });


})();