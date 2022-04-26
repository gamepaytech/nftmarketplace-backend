const Nft = require("../models/presaleNfts");
const models = require("../models/User");
const Vesting = require("../models/vesting");
const LockedToken = require("../models/lockedTokens");

// const createVestingData = async (req,res) => [
//   try {
//     const { 
//       wallet_address,
//         amount_invested,
//         allotted_qty,
//         unit_price,
//         unit_currency
//         amount_invested: { type:String},
//         allotted_qty: { type:String},
//         unit_price: { type:String},
//         unit_currency: { type:String}
//     } = req.body;
//   }
//   catch(err) {
//     console.log(err);
//     res.status(500).json({
//       err:"Internal Server Error!"
//     })
//   }
// ]

const vestingGetData = async (req,res) => {
  try {
    const findData = await Vesting.find({});

    if(!findData) {
      return res.status(404).json({
        err:"No token vesting data found!"
      })
    }

    res.status(200).json({
      data:findData,
      status:200
    })
  } 
  catch(err) {
    console.log(err);
    res.status(500).json({
      err:"500: Internal Server Error!",
      status: 500
    })
  }
}

const getVestingByWallet = async (req,res) => {
  try {
    const findByWallet = await Vesting.findOne({
      wallet_address:req.body.walletAddress
    })

    if(!findByWallet) {
      return res.status(404).json({
        err:"No data found"
      })
    }
    res.status(200).json({
      data:findByWallet,
      status:200
    })
  }
  catch(err) {
    console.log(err);
    res.status(500).json({
      err:"Internal server error!"
    })
  }
}

const getLockedTokens = async (req,res) => {
  try {
    const getData = await LockedToken.find({
      wallet_address:req.body.walletAddress
    });
    if(!getData) {
      res.status(404).json({
        err:"Internal Server Error!"
      })
    }

    res.status(200).json({
      data:getData,
      status:200
    })
  }
  catch(err) {
    console.log(err);
  }
}


module.exports = {
  vestingGetData,
  getVestingByWallet,
  getLockedTokens
}