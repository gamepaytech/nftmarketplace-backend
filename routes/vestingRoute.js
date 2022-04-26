const express = require('express')
const router = express.Router()
const cors = require('cors')

const {
  vestingGetData,
  getVestingByWallet
} = require("../controller/vestingController");

const { authenticateUser } = require('../middleware/authentication')

router.post("/get-vesting-by-wallet",cors(),getVestingByWallet);
// router.get("/")

module.exports = router