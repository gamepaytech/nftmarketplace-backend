const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
  createPromoCode,
  getPromoCode,
  getAllCheckCode
} = require("../controller/PromoController");
const { authenticateUser } = require('../middleware/authentication');

router.post('/create-promo-code', cors(), authenticateUser, createPromoCode);
router.post('/verify-promo-code',cors(),authenticateUser,getPromoCode);
router.get('/get-all-promo',cors(),authenticateUser,getAllCheckCode);

module.exports = router