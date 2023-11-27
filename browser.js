const puppeteer = require("puppeteer");


const BrowserInit = async() => {
  let browser
  try {
    browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir:"./tmp"
  });
  } catch (e) {
    console.log("Error on browser",e);
  }
  return browser
}



module.exports = BrowserInit