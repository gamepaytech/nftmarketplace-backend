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
const { authenticateUser,authenticateAdmin } = require('../middleware/authentication');

router.post('/create-promo-code', cors(), authenticateAdmin, createPromoCode);
router.post('/update-promo-code', cors(), authenticateAdmin, updatePromoCode);
router.post('/delete-promo-code', cors(), authenticateAdmin, deletePromoCode);
router.post('/verify-promo-code',cors(),authenticateUser,getPromoCode);
router.get('/get-all-promo',cors(),authenticateAdmin ,getAllCheckCode);
router.post('/disable-promo-code',cors(),authenticateAdmin ,updateCouponCode);
router.post('/claim-coupon-code',cors(),authenticateUser,claimPromoCode);


module.exports = router