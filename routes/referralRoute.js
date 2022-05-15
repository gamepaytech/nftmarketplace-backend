const express = require('express')
const router = express.Router()
const cors = require('cors')

const {
  vestingGetData,
  getVestingByWallet,
  getLockedTokens,
  createVestingData,
  updateVestingDataById,
  deleteVestingDataById
} = require("../controller/referralController");

const { authenticateUser, authenticateAdmin } = require('../middleware/authentication')

router.get("/get-referrals-by-userid",cors(),authenticateUser,getReferralsByUserId);
router.get("/get-referral-by-userid-and-refid",cors(),authenticateUser,vestingGetData);
router.get("/get-base-comission",cors(),authenticateUser,vestingGetData);

router.post("/get-vesting-by-wallet",cors(),getVestingByWallet);
router.post("/get-locked-tokens-by-wallet",cors(),getLockedTokens);
router.post("/create-vesting",cors(),authenticateAdmin,createVestingData);
router.put("/update-vesting-data",cors(),authenticateAdmin,updateVestingDataById);
router.delete("/vesting-delete-by-id",cors(),authenticateAdmin,deleteVestingDataById);

module.exports = router