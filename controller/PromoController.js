const PromoCode = require("../models/PromoCode");
var voucher_codes = require('voucher-code-generator');

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


const createPromoCode = async (req,res) => {
  try {
    let {
      validTill,
      totalNumberCode,
      percentDiscount
    } = req.body;
    if(!validTill) {
      return res.status(401).json({
        err:"Please provide the validity for the promo code."
      })
    }
    if(!totalNumberCode) {
      return res.status(401).json({
        err:"Please provide the total number of code to make it live."
      })
    }
    if(!percentDiscount) {
      return res.status(401).json({
        err:"Please provide the percent discount."
      })
    }
    //valid till get in days
    validTill = addDays(new Date(),validTill);
    let voucherCode = voucher_codes.generate({
      prefix: "GAMEPAY-",
      postfix: "-2022",
      length: 6,
      count: 1
    });

    console.log("Voucher code ",voucherCode);
    console.log("VALID TILL", validTill);

    let createObj = {
      promoCode:voucherCode[0],
      validTill,
      totalNumberCode,
      percentDiscount
    }

    const createCode = await PromoCode.create(createObj);

    console.log("create code ",createCode);
    res
      .status(200)
      .json({
        data:{
          promoCode:voucherCode,
          validTill,
          totalNumberCode,
          percentDiscount
        }
      });
  }
  catch(err) {
    console.log('ccreatePromoCode ',err)
    res.status(401).json({
      err:"401: Internal Server Error",
      status:401
    })
  }
}

const getPromoCode = async (req,res) => {
  try {
    const {promoCode} = req.body;
   
    const checkCode = await PromoCode.findOne({
      promoCode
    });

    if(!checkCode) {
      return res.status(404).json({
        err:"Promo code isn't valid.",
        status:401
      });
    }

    console.log("Promo code DB ",checkCode.promoCode);
    console.log("Promo code USR ",promoCode);
    let isValid;

    //3 checks 
    //1st date
    //2nd Matches with db
    //3rd total claimed is less than total coupons available

    if(checkCode.promoCode === promoCode) {
      isValid = true;
    }
    else {
      isValid = false
    }
 
    res.status(200).json({
      msg:"Promo Code has been successfully applied!",
      isValid:isValid,
      status:200
    });

  }
  catch(err) {
    console.log('ccreatePromoCode ',err)
    res.status(401).json({
      err:"401: Internal Server Error",
      status:401
    })
  }
}

const getAllCheckCode = async (req,res) => {
  try {
    const getAll = await PromoCode.find();

    if(!getAll) {
      return res.status(404).json({
        data:getAll
      });
    }

    res.status(200).json({
      data:getAll,
      status:200,
      dataLength:getAll?.length
    });

  }
  catch(err) {
    console.log(err);
    res.status(401).json({
      err:"401: Internal Server Error",
      status:401
    })
  }
}

module.exports = { createPromoCode, getPromoCode, getAllCheckCode }