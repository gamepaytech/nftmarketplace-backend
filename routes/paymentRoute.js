const express = require("express");
const {createPayment} = require("../controller/paymentController");

const router = express.Router()
const { authenticateUser } = require('../middleware/authentication')

router.route("/create-pay").post(createPayment);

module.exports = router;