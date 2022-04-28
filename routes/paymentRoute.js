const express = require("express");
const {
    createPayment,
    coinbasePayment,
    handleCoinbasePayment,
    coinbaseSuccess,
    coinbaseFail,
    createPaymentAAA,
    saveCirclePaymentData,
    sendPaymentEmail,
    tripleAWebhook
} = require("../controller/paymentController");

const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const bodyParser = require('body-parser');

router.route("/create-pay").post(createPayment);
router.route("/circle-store-pay").post(saveCirclePaymentData);
router.route("/create-pay-aaa").post(createPaymentAAA);
router.route("/coin-create-pay/:chikId/:email/:userId/:quantity").get(coinbasePayment);
router.route("/coin-handle-pay").post(handleCoinbasePayment);
router.route("/coin-success-pay").get(coinbaseSuccess);
router.route("/coin-failure").get(coinbaseFail);
router.route("/send-confirmation").post(sendPaymentEmail);

router.route("/triplea-webhook-payment").post(bodyParser.raw({type: 'application/json'}),tripleAWebhook);

module.exports = router;
