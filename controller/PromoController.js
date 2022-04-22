const PromoCode = require("../models/PromoCode");
var voucher_codes = require('voucher-code-generator');

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


const createPromoCode = async (req,res) => {
  try {
    const {
      promoCode,
      validTill,
      totalNumberClaimed,
      totalNumberCode
    } = req.body;

    //valid till get in days
    validTill = addDays(validTill);
    voucher_codes.generate({
      prefix: "GAMEPAY-",
      postfix: "-2022",
      length: 6,
      count: 1
    });

    console.log("VALID TILL", validTill);
    const createObj = {
      promoCode,
      validTill,
      totalNumberClaimed,
      totalNumberCode
    }

    const createCode = await PromoCode.create(createObj);

    console.log(createCode);
  }
  catch(err) {
    console.log('ccreatePromoCode ',err)
    res.status(401).json({
      err:"Internal Server Error",
      status:401
    })
  }
}

module.exports = { createPromoCode }