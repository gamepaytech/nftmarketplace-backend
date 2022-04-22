const express = require('express')
const router = express.Router()

const {
  createPromoCode
} = require("../controller/PromoController");

router.route('/create-promo-code').post(createPromoCode);

module.exports = router