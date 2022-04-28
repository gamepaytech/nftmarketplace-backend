const PromoCode = require("../models/PromoCode");
var voucher_codes = require('voucher-code-generator');
const models = require("../models/User");

// function addDays(date, days) {
//   var result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};


const createPromoCode = async (req, res) => {
  try {
    let {
      validTill,
      totalNumberCode,
      percentDiscount,
      promoCode
    } = req.body;
    if (!validTill || validTill < 0) {
      return res.status(401).json({
        err: "Please provide the validity for the promo code."
      })
    }
    if (!totalNumberCode || totalNumberCode < 0) {
      return res.status(401).json({
        err: "Please provide the correct total number of code to make it live."
      })
    }
    if (!percentDiscount) {
      return res.status(401).json({
        err: "Please provide the percent discount."
      })
    }
    if (percentDiscount < 0 || percentDiscount > 100) {
      return res.status(401).json({
        err: "Please provide the percent discount in range of 0 to 100."
      })
    }
    if (!promoCode) {
      return res.status(401).json({
        err: "Please provide the promo code."
      })
    }
    const checkCode = await PromoCode.findOne({
      promoCode: req.body.promoCode
    })
    if (checkCode !== null) {
      return res.status(400).json({
        err: "Code already exists!",
        status: 400
      })
    }

    const date = new Date();
    const endDate = date.setDate(date.getDate() + Number(validTill));
    // const endDate = new  Date(endTimeStamp)
    // console.log(endTimeStamp,endDate,"end")


    let createObj = {
      promoCode: promoCode,
      validTill: endDate,
      totalNumberCode,
      percentDiscount
    }

    const createCode = await PromoCode.create(createObj);

    res
      .status(200)
      .json({
        data: {
          promoCode: promoCode,
          endDate,
          totalNumberCode,
          percentDiscount
        }
      });
  }
  catch (err) {
    console.log('ccreatePromoCode ', err)
    res.status(401).json({
      err: "401: Internal Server Error",
      status: 401
    })
  }
}

const updatePromoCode = async (req, res) => {
  try {
    let {
      validTill,
      totalNumberCode,
      percentDiscount,
      promoCode,
      isEnabled
    } = req.body;
    if (!validTill || validTill < 0) {
      return res.status(401).json({
        err: "Please provide the validity for the promo code."
      })
    }
    if (!totalNumberCode || totalNumberCode < 0) {
      return res.status(401).json({
        err: "Please provide the correct total number of code to make it live."
      })
    }
    if (!percentDiscount) {
      return res.status(401).json({
        err: "Please provide the percent discount."
      })
    }
    if (percentDiscount < 0 || percentDiscount > 100) {
      return res.status(401).json({
        err: "Please provide the percent discount in range of 0 to 100."
      })
    }
    if (!promoCode) {
      return res.status(401).json({
        err: "Please provide the promo code."
      })
    }
    const checkCode = await PromoCode.findOne({
      promoCode: req.body.promoCode
    })
    if (checkCode == null) {
      return res.status(400).json({
        err: "Code does not exists!",
        status: 400
      })
    }

    const date = new Date();
    const endDate = date.setDate(date.getDate() + Number(validTill));

    await PromoCode.updateOne({ promoCode: promoCode },
      {
        validTill: endDate,
        totalNumberCode,
        percentDiscount,
        promoCodeStatus: isEnabled
      })

    res
      .status(200)
      .json({
        data: {
          promoCode: promoCode,
          endDate,
          totalNumberCode,
          percentDiscount,
          isEnabled
        }
      });
  }
  catch (err) {
    console.log('ccreatePromoCode ', err)
    res.status(401).json({
      err: "401: Internal Server Error",
      status: 401
    })
  }
}

const deletePromoCode = async (req, res) => {
  try {
    let {
      promoCode
    } = req.body;
   
    if (!promoCode) {
      return res.status(401).json({
        err: "Please provide the promo code."
      })
    }
    const checkCode = await PromoCode.findOne({
      promoCode: req.body.promoCode
    })
    if (checkCode == null) {
      return res.status(400).json({
        err: "Code does not exists!",
        status: 400
      })
    }

    await PromoCode.deleteOne({
      promoCode: req.body.promoCode
    })

    res
      .status(200)
      .json({
        data: {
          promoCode: promoCode,
        }
      });
  }
  catch (err) {
    console.log('ccreatePromoCode ', err)
    res.status(401).json({
      err: "401: Internal Server Error",
      status: 401
    })
  }
}

const getPromoCode = async (req, res) => {
  try {
    const { promoCode } = req.body;

    const checkCode = await PromoCode.findOne({
      promoCode
    });

    if (!checkCode) {
      return res.status(404).json({
        err: "VALIDATION_ERR: Promo code isn't valid.",
        status: 401
      });
    }

    let isValid;
    //3 checks 
    //1st date --> validity > currDate
    //2nd Matches with db --> checkCode.promoCode === promoCode
    //3rd total claimed is less than total coupons available --> checkCode.totalNumberCode < checkCode.totalNumberClaimed
    const currDate = new Date().getTime();
    const validity = checkCode.validTill;
    if (
      checkCode.totalNumberCode > checkCode.totalNumberClaimed &&
      validity > currDate &&
      checkCode.promoCode === promoCode &&
      checkCode.promoCodeStatus) {
      isValid = true;
    }
    else {
      isValid = false
    }
    console.log("isValid ", isValid)
    if (!isValid) {
      return res.status(400).json({
        err: "Validation Error: Promo code isn't valid",
        status: 400
      })
    }

    res.status(200).json({
      msg: "Promo Code has been successfully applied!",
      isValid: isValid,
      discount: checkCode.percentDiscount,
      status: 200
    });

  }
  catch (err) {
    console.log('ccreatePromoCode ', err)
    res.status(401).json({
      err: "401: Internal Server Error",
      status: 401
    })
  }
}

const getAllCheckCode = async (req, res) => {
  try {
    const getAll = await PromoCode.find();

    if (!getAll) {
      return res.status(404).json({
        data: getAll
      });
    }

    res.status(200).json({
      data: getAll,
      status: 200,
      dataLength: getAll?.length
    });

  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      err: "401: Internal Server Error",
      status: 401
    })
  }
}

const updateCouponCode = async (req, res) => {
  try {
    const findUser = await models.users.findOne({
      _id: req.body.userId
    })
    if (!findUser?.isAdmin || !findUser?.isSuperAdmin) {
      return res.status(400).json({
        err: "Invalid Operation: Authorization failed."
      })
    }
    const checkCode = await PromoCode.findOne({
      promoCode: req.body.promoCode
    })
    let message = '';
    if (checkCode.promoCodeStatus == true) {
      message = 'Promo Code has been disabled!'
    }
    else {
      message = 'Promo Code has been enabled!'
    }
    checkCode.promoCodeStatus = !checkCode.promoCodeStatus;
    await checkCode.save();

    res.status(200).json({
      promoCodeStatus: !checkCode.promoCodeStatus,
      msg: message,
      staus: 200
    })
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      err: "401: Internal Server Error",
      status: 401
    })
  }
}

const claimPromoCode = async (req, res) => {
  try {
    const checkCode = await PromoCode.findOne({
      promoCode: req.body.promoCode
    })
    if (!checkCode) {
      return res.status(404).json({
        err: "Promo code not found!"
      })
    }
    if (checkCode.promoCodeStatus == false) {
      return res.status(400).json({
        err: "Pomo code isn't valid!"
      })
    }
    // checkCode.totalNumberClaimed = checkCode.totalNumberClaimed + 1;
    await PromoCode.updateOne({ promoCode: req.body.promoCode },
      { totalNumberClaimed: checkCode.totalNumberClaimed + 1 }
    )

    res.status(200).json({
      msg: "Promo code has been applied!",
      staus: 200
    })
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      err: "401: Internal Server Error",
      status: 401
    })
  }
}

module.exports = {
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  getPromoCode,
  getAllCheckCode,
  updateCouponCode,
  claimPromoCode
}