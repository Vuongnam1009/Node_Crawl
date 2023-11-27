const { ScraperLink, ScraperProduct } = require('./scraper');
const { CheckProductLink, CheckUrl } = require('./utils/check');



async function processArray(browser,arr) {
for (let element of arr) {
await ScraperProduct(browser, element.link)
}
}
const ScraperController = async (browserInstance) => {
  // const url = 'https://4fanshop.com/collections/ring-nfl'
  const url = 'https://4fanshop.com/collections/ring-nfl/?page=4'
  const selectorProduct = '.grid-uniform > .grid-item>a'
  const selectorProductDisabled = 'div > div > div > ul > li:last-child.disabled'
  const selectorNextPage = 'div > div > div > ul > li:last-child > a'
  try {
    let browser = await browserInstance
    // let urlCheck = await CheckUrl(browser, url)
    // if (urlCheck.status) {
    //   console.log("<<< Check url success");
    //   let productCheck = await CheckProductLink(urlCheck.page, selectorProduct)
    //   if (productCheck.status) {
    //     console.log("<<< Check product link success");
    //   } else {
    //     console.log("<<< Check product link error: ",productCheck.code);
    //   }
    // } else {
    //   console.log("<<< Check url error: ",urlCheck.code);
    // }
    // await ScraperProduct(browser, url)


    let linkList = await ScraperLink(browser, url,{selectorProduct,selectorProductDisabled,selectorNextPage})
    // await processArray(browser,linkList)
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> Success scraper");
    await browser.close()
 } catch (error) {
  console.log("Error in Scraper controller", error);
  }
}


module.exports = ScraperController