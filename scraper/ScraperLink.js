
const ScraperLink = async (browser, url,{selectorProduct,selectorProductDisabled,selectorNextPage}) => new Promise(async(resolve, reject) => {
  {


    try {
      console.log(">> Start load product link ...");
      let isBtnDisabled = false;
      let item = [];
      let page = await browser.newPage();
      await page.goto(url)
      await page.waitForSelector('body')

      while (!isBtnDisabled) {
        let linkProducts = await page.$$eval(selectorProduct, (els) => {
          let links = []
          for (let el of els) {
            if (el.href) {
              let link = el.href
              links.push({link})
            }
          }
          return links
        });
        item = [
          ...item,
          ...linkProducts
        ]

        // await page.waitForSelector("div > div > div > ul > li:nth-child(7) > a", { visible: true });
        const is_disabled = (await page.$(selectorProductDisabled)) !== null;
        isBtnDisabled = is_disabled;
        if (!is_disabled) {
          await Promise.all([
            page.click(selectorNextPage),
            page.waitForNavigation({ waitUntil: "networkidle2" }),
          ]);}
      }
    console.log(">> Success scraper links: have ",item.length," link");
    resolve(item)
  } catch (error) {
    console.log("Error in scrapeLink", error);
    reject(error);
  }
}
})


module.exports = ScraperLink