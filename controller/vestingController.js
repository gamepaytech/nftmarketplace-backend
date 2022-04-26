const Nft = require("../models/presaleNfts");
const models = require("../models/User");
const Vesting = require("../models/vesting");


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
    const findByWallet = await Vesting.find({
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



module.exports = {
  vestingGetData,
  getVestingByWallet
}