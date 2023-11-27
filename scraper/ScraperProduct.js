const fs = require("fs");
const {ParsePrice,TotalPrice} = require('../utils/parsePrice');

const ScraperProduct = async (browser, url) => new Promise(async (resolve, reject) => {
  let product = {}
  const titleSelector = '#ProductSection > div.grid > div.grid-item.large--three-fifths > h1'
  const typeSelector = '#ProductSection > nav > a:nth-child(3)'
  const bodySelector = '#ProductSection > div.grid > div.grid-item.large--three-fifths > div.product-description.rte'
  const imagesSelector = '#productThumbs-product-template > li>a'

  try {
    console.log(">> Start scraper product: ", handle);
    let urlArr = url.split("/");
    let handle = urlArr[urlArr.length - 1];
    let title = ""


    let page = await browser.newPage();
    // console.log(">> Open new tab ...");
    await page.goto(url);
    // console.log(">> Go to website: " + url);
    // await page.waitForSelector('body');

    // Get title
    title = await page.$eval(titleSelector, (e) => e.textContent)

    const type = await page.$eval(typeSelector, (e) => e.textContent)
    // Get body
    const stringWithLineBreaks = await page.$eval(bodySelector, (e) => e.outerHTML)
    const body = stringWithLineBreaks.replace(/\r?\n|\r/g, '').replace(/,/g, ".")

    product.title = title;
    product.body_html = body
    product.collections = []
    product.custom_options = []
    product.metafields_global_description_tag = ""
    product.metafields_global_title_tag = ""
    product.product_availability = 1
    product.tracking_access_token = ""
    product.tracking_id = ""
    product.tags = ""
    product.type = type
    // Get image
    const images = await page.$$eval(imagesSelector, (els) => els.map((el, i) => {
      let src = el.href
      let arr = src.split("/");
      let handle = arr[arr.length - 1];
      let filename = handle.split("?")[0];

      return {
        src,
        position: i + 1,
        // isUploading: false,
        // filename
      }
      })
    );
    product.images = images
    const  { options, variants } = await scraperOptions(page)
    product.options = options
    product.variants = variants

    product.variantDefault ={
      active: true,
      option1: "",
      price: 0,
      sku: "",
      compare_at_price: 0,
      cost_per_item: 0,
      bar_code: 0,
      weight: 0,
      is_default: false,
      weight_unit: "lb",
      inventory_quantity: 0,
      inventory_management:"" ,
      inventory_policy: "continue",
      requires_shipping: true,
      taxable: true,
      fulfillment_service: "shopbase",
      variant_images: [],
      shipping_profile_id: 0
    }
    // let jsonString = JSON.stringify(product);
    console.log(product);
    await page.close();
    console.log(">> Success scraper product: ", handle);
    resolve();

  } catch (e) {
    console.log("Error in product", e);
    reject(e);
  }



})


const scraperOptions = async (page) => {
  let options = []
  let variants =[]
  let options1 = {}
  let options2 = {}
  let options3 = {}
  const example = {
    active: true,
    bar_code: 0,
    compare_at_price: 0,
    cost_per_item: 0,
    fulfillment_service: "shopbase",
    inventory_management: "",
    inventory_policy: "continue",
    inventory_quantity: 0,
    requires_shipping: true,
    shipping_profile_id: 0,
    sku: "",
    taxable: true,
    variant_images: [],
    weight: 0,
    weight_unit: "lb"
  }

  // Get option
  const option1Exist = (await page.$("#productSelect-product-template-option-0")) !== null;
  const option2Exist = (await page.$("#productSelect-product-template-option-1")) !== null;
  const option3Exist = (await page.$("#productSelect-product-template-option-2")) !== null;

  if (option1Exist) {
    let name = await page.$eval('label[for="productSelect-product-template-option-0"]', (label) => label.textContent)
    let values = await page.$$eval('#productSelect-product-template-option-0 > option', (els) => {
      const data = els.map(el => {
        return el.value
      });
      return data;
    });
    options1 = {name,values}
    options = [
      ...options,
      {name,values}
    ]
  }
  if (option2Exist) {
    let name = await page.$eval('label[for="productSelect-product-template-option-1"]', (label) => label.textContent)
    let values = await page.$$eval('#productSelect-product-template-option-1 > option', (els) => {
      const data = els.map(el => {
        return el.value
      });
      return data;
    });
    options2 = { name, values }
    options = [
      ...options,
      {name,values}
    ]
  }
  if (option3Exist) {
    let name = await page.$eval('label[for="productSelect-product-template-option-2"]', (label) => label.textContent)
    let values = await page.$$eval('#productSelect-product-template-option-2 > option', (els) => {
      const data = els.map(el => {
        return el.value
      });
      return data;
    });
    options3 = { name, values }
    options = [
      ...options,
      {name,values}
    ]
  }


  let price = 0
  if (option1Exist) {
    let position = 1
    for (let i = 0; i < options1.values.length; i++) {
      await page.select('#productSelect-product-template-option-0', options1.values[i]);
      if (option2Exist) {
        for (let j = 0; j < options2.values.length; j++) {
          await page.select('#productSelect-product-template-option-1', options2.values[j]);
          if (option3Exist) {
            for (let k = 0; k < options3.values.length; k++) {
              await page.select('#productSelect-product-template-option-2', options3.values[k]);
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
            let is_sale = (await page.$('#comparePrice-product-template')) !== null;
            price = ParsePrice(priceData)
            let compare_at_price = price
            if (is_sale) {
              let sale = await page.$eval('#comparePrice-product-template', e => e.textContent)
              let priceSale = ParsePrice(sale)
              compare_at_price = TotalPrice(priceSale,price)
            }
            variants = [
              ...variants,
              {
                ...example,
                option1: options1.values[i],
                option2: options2.values[j],
                position,
                price,
                compare_at_price,
                title: `${options1.values[i]} / ${options2.values[j]}`
              }
            ]
            position++
          }
        }
      } else {
        priceData = await page.$eval('#productPrice-product-template > span.visually-hidden', e => e.textContent);
        price =parseFloat(priceData.replace(/\$/g, ''))
        options = [
          ...options,
          `${i===0 ? options1.label:""},${options1.value[i]},,,,,,,,,deny,manual, ${price}`
        ];
      }
    }

  }
  return { options, variants };
}


module.exports = ScraperProduct