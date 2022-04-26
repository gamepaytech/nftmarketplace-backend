const express = require('express')
const router = express.Router()
const cors = require('cors')

const {
  vestingGetData,
  getVestingByWallet,
  getLockedTokens
} = require("../controller/vestingController");

const { authenticateUser } = require('../middleware/authentication')

router.post("/get-vesting-by-wallet",cors(),getVestingByWallet);
router.post("/get-locked-tokens-by-wallet",cors(),getLockedTokens);

module.exports = router