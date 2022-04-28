const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
  createPromoCode,
  getPromoCode,
  getAllCheckCode,
  updateCouponCode,
  claimPromoCode,
  updatePromoCode,
  deletePromoCode
} = require("../controller/PromoController");
const { authenticateUser } = require('../middleware/authentication');

router.post('/create-promo-code', cors(), authenticateUser, createPromoCode);
router.post('/update-promo-code', cors(), authenticateUser, updatePromoCode);
router.post('/delete-promo-code', cors(), authenticateUser, deletePromoCode);
router.post('/verify-promo-code',cors(),authenticateUser,getPromoCode);
router.get('/get-all-promo',cors(),authenticateUser,getAllCheckCode);
router.post('/disable-promo-code',cors(),authenticateUser,updateCouponCode);
router.post('/claim-coupon-code',cors(),authenticateUser,claimPromoCode);


module.exports = router