
const ParsePrice = (string) => {

  const  priceStr = string.split("$")[1]
  const price = parseInt(parseFloat(priceStr)*100)/100 || 0
  return price
}

const TotalPrice = (price,sale) => {

  return parseInt(price*100 + sale * 100)/100
}

module.exports = { ParsePrice, TotalPrice };