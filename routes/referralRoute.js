const express = require('express')
const router = express.Router()
const cors = require('cors')

const {
  createReferral,
  getReferralsByUserId,
  updateReferral,
  deleteReferral,
  setDefaultReferralByUser
} = require("../controller/referralController");

const { authenticateUser, authenticateAdmin } = require('../middleware/authentication')

router.post("/create",cors(),authenticateUser,createReferral);
router.post("/getReferralsByUserId",cors(),authenticateUser,getReferralsByUserId);
router.post("/setDefaultByUser",cors(),authenticateUser,setDefaultReferralByUser);
router.post("/update",cors(),authenticateUser,updateReferral);
router.post("/delete",cors(),authenticateUser,deleteReferral);

module.exports = router
