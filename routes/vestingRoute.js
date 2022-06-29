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
} = require("../controller/vestingController");

const { authenticateUser, authenticateAdmin } = require('../middleware/authentication')

router.get("/get-all-vesting",cors(),authenticateUser,vestingGetData);
router.post("/get-vesting-by-wallet",cors(),getVestingByWallet);
router.post("/get-locked-tokens-by-wallet",cors(),getLockedTokens);
router.post("/create-vesting",cors(),authenticateAdmin,createVestingData);
router.put("/update-vesting-data",cors(),authenticateAdmin,updateVestingDataById);
router.delete("/vesting-delete-by-id",cors(),authenticateAdmin,deleteVestingDataById);

module.exports = router