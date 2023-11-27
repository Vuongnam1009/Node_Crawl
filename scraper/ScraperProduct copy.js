const fs = require("fs");

const ScraperProduct = async (browser, url) => new Promise(async(resolve, reject) => {
  {
    try {
      let urlArr = url.split("/");
      let handle = urlArr[urlArr.length - 1];



      let title = ""
      let body =""
      let vendor = ""
      let type = ""
      let tags = ""
      let published = "TRUE"
      let optionFulfill = ""
      let customOption = ""

      let variantSku = ""
      let variantGram = ""
      let variantInventoryTracker = ""
      let variantInventoryQty = ""
      let variantInventoryPolicy = "deny"
      let variantFulfillmentService = "manual"
      let variantPrice = "00.00"
      let variantCompareAtPrice = ""
      let variantRequiresShipping = "TRUE"
      let variantTaxable = "TRUE"
      let variantBarcode = "TRUE"
      let imageSrc = ""
      let imagePosition = 0
      let imageAltText = ""
      let giftCard = ""
      let googleShoppingMpn = ""
      let googleShoppingAge = ""
      let googleShoppingGender = ""
      let googleShoppingProduct = ""
      let seoTitle = ""
      let seoDescription = ""
      let googleShoppingAdwordsGroup = ""
      let googleShoppingAdwordsLabel = ""
      let googleShoppingCondition = ""
      let googleShoppingCustomProduct = ""
      let googleShoppingCustomLabel0 = ""
      let googleShoppingCustomLabel1 = ""
      let googleShoppingCustomLabel2 = ""
      let googleShoppingCustomLabel3 = ""
      let googleShoppingCustomLabel4 = ""
      let variantImage = ""
      let variantWeightUnit = "kg"
      let variantTaxCode = ""
      let costPerItem = 0
      let availableOnListingPages = "TRUE"
      let availableOnSitemapFiles = "FALSE"
      let template = "Default"
      let shippingProfileName = ""
      let variantTag = ""
      let facebookPixelId = ""
      let facebookAccessToken = ""
      let productStockStatus = ""
      let shippingFee = ""
      let baseCostVariant =""









      console.log(">> Start scraper product: ", handle);
      let page = await browser.newPage();
      // console.log(">> Open new tab ...");
      await page.goto(url);
      // console.log(">> Go to website: " + url);
      await page.waitForSelector('.template-product');


      // console.log(">> Load website done...");



      // Get title
      title = await page.$eval('#ProductSection > div.grid > div.grid-item.large--three-fifths > h1', (e) => e.textContent)

      // Get body
      const stringWithLineBreaks = await page.$eval('#ProductSection > div.grid > div.grid-item.large--three-fifths > div.product-description.rte', (e) => e.outerHTML)
      body = stringWithLineBreaks.replace(/\r?\n|\r/g, '').replace(/,/g, ".")

      // Get image
      const images = await page.$$eval('#productThumbs-product-template > li', (els) => els.map((el,i)=> {
          return {link: el.querySelector('a').href, position:i }
        })
      );
      const options = await scraperOptions(page)

      const numOption = options.length -1
      const numImage = images.length -1

      const colCount = numImage >numOption ? numImage : numOption

      for (let index = 0; index < colCount; index++) {
        let isFist = index === 0
        let isOption = index <= numOption
        let isImage = index <= numImage


let productToCsv = `, ,
${index <= numOption ? handle : ""},
${isFist ? title : ""},
${isFist ? body : ""},
${isFist ? vendor : ""},
${isFist ? type : ""},
${isFist ? tags : ""},
${isFist ? published : ""},
${isFist ? optionFulfill : ""},
${isFist ? customOption : ""},
${isOption ? options[index] : ""},
${isOption ? variantCompareAtPrice : ""},
${isOption ? variantRequiresShipping : ""},
${isOption ? variantTaxable : ""},
${isOption ? variantBarcode : ""},
${isImage ? images[index].link : ""},
${isImage ? images[index].position : ""},
${isImage ? imageAltText : ""},
${isFist ? giftCard : ""},
${isFist ? googleShoppingMpn : ""},
${isFist ? googleShoppingAge : ""},
${isFist ? googleShoppingGender : ""},
${isFist ? googleShoppingProduct : ""},
${isFist ? seoTitle : ""},
${isFist ? seoDescription : ""},
${isFist ? googleShoppingAdwordsGroup : ""},
${isFist ? googleShoppingAdwordsLabel : ""},
${isFist ? googleShoppingCondition : ""},
${isFist ? googleShoppingCustomProduct : ""},
${isFist ? googleShoppingCustomLabel0 : ""},
${isFist ? googleShoppingCustomLabel1 : ""},
${isFist ? googleShoppingCustomLabel2 : ""},
${isFist ? googleShoppingCustomLabel3 : ""},
${isFist ? googleShoppingCustomLabel4 : ""},
${isFist ? variantImage : ""},
${isOption ? variantWeightUnit : ""},
${isFist ? variantTaxCode : ""},
${isFist ? costPerItem : ""},
${isFist ? availableOnListingPages : ""},
${isFist ? availableOnSitemapFiles : ""},
${isFist ? template : ""},
${isFist ? shippingProfileName : ""},
${isFist ? variantTag : ""},
${isFist ? facebookPixelId : ""},
${isFist ? facebookAccessToken : ""},
${isFist ? productStockStatus : ""},
${isFist ? shippingFee : ""},
${isFist ? baseCostVariant : ""}`;

        line = productToCsv.replace(/\r?\n|\r/g, '')

        fs.appendFile(
             "results.csv",
             `${line}\n`,
             function (err) {
               if (err) throw err;
             }
        );
      }
     await page.close();
      console.log(">> Success scraper product: ", handle);
      resolve();

    } catch (e) {
      console.log("Error in product", e);
      reject(e);
    }
  }

})


const scraperOptions = async(page) => {
  let options1 = {}
  let options2 = []
  let options3 = []

  // Get option
  const option1Exist = (await page.$("#productSelect-product-template-option-0")) !== null;
  const option2Exist = (await page.$("#productSelect-product-template-option-1")) !== null;
  const option3Exist = (await page.$("#productSelect-product-template-option-2")) !== null;

  if (option1Exist) {
    let label = await page.$eval('label[for="productSelect-product-template-option-0"]', (label) => label.textContent)
    let value = await page.$$eval('#productSelect-product-template-option-0 > option', (els) => {
      const data = els.map(el => {
        return el.value
      });
      return data;
    });
    options1 = {label,value}
  }
  if (option2Exist) {
    let label = await page.$eval('label[for="productSelect-product-template-option-1"]', (label) => label.textContent)
    let value = await page.$$eval('#productSelect-product-template-option-1 > option', (els) => {
      const data = els.map(el => {
        return el.value
      });
      return data;
    });
    options2 = {label,value}
  }
  if (option3Exist) {
    let label = await page.$eval('label[for="productSelect-product-template-option-2"]', (label) => label.textContent)
    let value = await page.$$eval('#productSelect-product-template-option-2 > option', (els) => {
      const data = els.map(el => {
        return el.value
      });
      return data;
    });
    options3 = {label,value}
  }

  let options = []

  let price = 0
  if (option1Exist) {
    for (let i = 0; i < options1.value.length; i++) {
      await page.select('#productSelect-product-template-option-0', options1.value[i]);
      if (option2Exist) {
        for (let j = 0; j < options2.value.length; j++) {
          await page.select('#productSelect-product-template-option-1', options2.value[j]);

          if (option3Exist) {
            for (let k = 0; k < options3.value.length; k++) {
              await page.select('#productSelect-product-template-option-2', options3.value[k]);
              let priceData = await page.$eval('#productPrice-product-template > span.visually-hidden', e => e.textContent);
              price = priceData.replace(/\$/g, '')
              let isFist = i ===0&& j ===0 && k===0

              options = [
                ...options,
                `${isFist?options1.label:""},${options1.value[i]},${isFist?options2.label:""},${options2.value[j]},${isFist?options3.label:""},${options3.value[k]},,,,,deny,manual,${price}`
              ];
            }

          } else {
            let priceData = await page.$eval('#productPrice-product-template > span.visually-hidden', e => e.textContent);
            price =priceData.replace(/\$/g, '')
            options = [
              ...options,
              (i == 0&& j == 0)?`${options1.label}, ${options1.value[i]}, ${options2.label}, ${options2.value[j]},,,,,,,deny,manual, ${price}`:`,${options1.value[i]}, ,${options2.value[j]},,,,,,,deny,manual,${price}`
            ];
          }
        }
      } else {
        priceData = await page.$eval('#productPrice-product-template > span.visually-hidden', e => e.textContent);
        price =priceData.replace(/\$/g, '')
        options = [
          ...options,
          `${i===0 ? options1.label:""},${options1.value[i]},,,,,,,,,deny,manual, ${price}`
        ];
      }
    }

    return options;

}}


module.exports = ScraperProduct