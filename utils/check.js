

const CheckUrl = async (browser, url) =>
  {
    try {
      let page = await browser.newPage();
      console.log(">> Start check url...");
      await page.goto(url)
      await page.waitForSelector('body')
      return {
        status: 1,
        page
      }
  } catch (error) {
      return {
        status: 0,
        code: "Url not found",
    }
  }
}


const CheckProductLink = async (page,  selectorProduct) =>
  {
    try {
      console.log(">> Start check product link ...");
      let linkProducts = await page.$eval(selectorProduct, (els) => {
        return els.href
      });
      if (!!linkProducts) {
        return {status:1}

      } else {
        return {
          status: 0,
          code: "Selector product not found",
        }
    }
    } catch (error) {
       return {
          status: 0,
          code: "Selector product not found",
        }

  }
}


const CheckChangePage = async (page, { selectorProduct, selectorProductDisabled, selectorNextPage }) =>
  {
    try {


      let isBtnDisabled = false;
      let item = [];

      console.log(">> Start check product link ...");


      while (!isBtnDisabled) {

        let linkProducts = await page.$eval(selectorProduct, (els) => {
          let links = [els.href]
          // for (let el of els) {
          //   if (el.href) {
          //     let link = el.href
          //     links.push({link})
          //   }
          // }
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
    console.log(">> Success scraper links: have ",item," link");
  } catch (error) {
    console.log("Error in scrapeLink", error);
  }
}


module.exports = {CheckProductLink,CheckUrl}