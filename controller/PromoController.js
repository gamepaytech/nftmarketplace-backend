const PromoCode = require("../models/PromoCode");
var voucher_codes = require('voucher-code-generator');
const models = require("../models/User");

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
    const checkCode = await PromoCode.findOne({
      promoCode:req.body.promoCode
    })
    if(checkCode !== null) {
      return res.status(400).json({
        err:"Code already exists!",
        status:400
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

    let createObj = {
      promoCode:voucherCode[0],
      validTill,
      totalNumberCode,
      percentDiscount
    }

    const createCode = await PromoCode.create(createObj);

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
        err:"VALIDATION_ERR: Promo code isn't valid.",
        status:401
      });
    }

    let isValid;
    //3 checks 
    //1st date --> validity > currDate
    //2nd Matches with db --> checkCode.promoCode === promoCode
    //3rd total claimed is less than total coupons available --> checkCode.totalNumberCode < checkCode.totalNumberClaimed
    const currDate = Date.parse(new Date());
    const validity = Date.parse(checkCode.validTill);

    if(
      checkCode.totalNumberCode > checkCode.totalNumberClaimed &&
      validity > currDate &&  
      checkCode.promoCode === promoCode) {
      isValid = true;
    }
    else {
      isValid = false
    }
    console.log("isValid ",isValid)
    if(!isValid) {
      return res.status(400).json({
        err:"Validation Error: Promo code isn't valid",
        status:400
      })
    }
 
    res.status(200).json({
      msg:"Promo Code has been successfully applied!",
      isValid:isValid,
      discount:checkCode.percentDiscount,
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

const updateCouponCode = async (req,res) => {
  try {
    console.log("IN ")
    const findUser = await models.users.findOne({
      _id:req.body.userId
    })
    if(!findUser?.isAdmin || !findUser?.isSuperAdmin) {
      return res.status(400).json({
        err:"Invalid Operation: Authorization failed."
      })
    }
    const checkCode = await PromoCode.findOne({
      promoCode:req.body.promoCode
    })
    let message = '';
    if(checkCode.promoCodeStatus == true) {
      message = 'Promo Code has been disabled!'
    } 
    else {
      message = 'Promo Code has been enabled!'
    }
    checkCode.promoCodeStatus = !checkCode.promoCodeStatus;
    await checkCode.save();

    res.status(200).json({
      promoCodeStatus:!checkCode.promoCodeStatus,
      msg:message,
      staus:200
    })
  }
  catch(err) {
    console.log(err);
    res.status(401).json({
      err:"401: Internal Server Error",
      status:401
    })
  }
}

module.exports = { createPromoCode, getPromoCode, getAllCheckCode, updateCouponCode }