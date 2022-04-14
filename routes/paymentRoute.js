const express = require("express");
const {
    createPayment,
    coinbasePayment,
    handleCoinbasePayment,
    coinbaseSuccess,
    coinbaseFail,
    createPaymentAAA
} = require("../controller/paymentController");

const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

router.route("/create-pay").post(createPayment);
router.route("/create-pay-aaa").post(createPaymentAAA);
router.route("/coin-create-pay/:chikId/:email/:userId").get(coinbasePayment);
router.route("/coin-handle-pay").post(handleCoinbasePayment);
router.route("/coin-success-pay").get(coinbaseSuccess);
router.route("/coin-failure").get(coinbaseFail);

module.exports = router;
