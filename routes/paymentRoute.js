const express = require("express");
const {
    createPayment,
    coinbasePayment,
    handleCoinbasePayment,
    createPaymentAAA,
    saveCirclePaymentData,
    sendPaymentEmail,
    tripleAWebhook,
    coinbaseLaunchpadPayment,
    handleLaunchpadHook,
    makeLaunchpadPayment,
    getCommitedAmount,
    launchpadPaymentAAA,
    tripleAWebhookLaunchpad,
    getAllCommitedAmount,
    initiateLaunchpadPayment,
    errorLaunchpadPayment,
    getLaunchpadActivity,
    updateActivity,
    createCircleLaunchpadPayment,
    circleSNSResponse,
    getKeyForCircleLaunchpadPayment,
    getCardDetailsCircleLaunchpadPayment,
    paymentsCircleLaunchpadPayment
} = require("../controller/paymentController");

const {
    getAllPaymentsFromCircle,
    getPaymentInfoFromCircle
} = require('../controller/circleController');

const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const bodyParser = require('body-parser');

router.route("/create-pay").post(authenticateUser,createPayment);
router.route("/circle-store-pay").post(authenticateUser,saveCirclePaymentData);
router.route("/create-pay-aaa").post(authenticateUser,createPaymentAAA);
router.route("/coin-create-pay/:chikId/:email/:userId/:quantity").post(authenticateUser,coinbasePayment);
router.route("/coin-handle-pay").post(handleCoinbasePayment);
router.route("/send-confirmation").post(sendPaymentEmail);

router.route("/triplea-webhook-payment").post(bodyParser.raw({type: 'application/json'}),tripleAWebhook);
router.route("/coinbase-launchpad").post(authenticateUser,coinbaseLaunchpadPayment);
router.route("/coin-launchpad-hook").post(handleLaunchpadHook);
router.route("/makeLaunchpadPayment").post(authenticateUser,makeLaunchpadPayment);
router.route("/getCommitedAmount").get(authenticateUser,getCommitedAmount);
router.route("/getAllCommitedAmount").get(authenticateUser,getAllCommitedAmount);
router.route("/launchpadPayment").post(authenticateUser,launchpadPaymentAAA);
router.route("/tripleAWebhookLaunchpad").post(bodyParser.raw({type: 'application/json'}),tripleAWebhookLaunchpad)
router.route("/initiateLaunchpadPayment").post(authenticateUser,initiateLaunchpadPayment);
router.route("/errorLaunchpadPayment").post(authenticateUser,errorLaunchpadPayment);
router.route("/getAllLaunchpadActivity").get(authenticateUser,getLaunchpadActivity);

router.route("/createCircleLaunchpadPayment").post(authenticateUser,createCircleLaunchpadPayment);

//todo - replace launchpad with response and update the circle notifications
router.route("/circleSNSLaunchpad").post(circleSNSResponse);
router.route("/getKeyForCircleLaunchpadPayment").get(authenticateUser,getKeyForCircleLaunchpadPayment);
router.route("/getCardDetailsCircleLaunchpadPayment").post(authenticateUser,getCardDetailsCircleLaunchpadPayment);
router.route("/paymentsCircleLaunchpadPayment").post(authenticateUser,paymentsCircleLaunchpadPayment);
router.route("/getAllPaymentsFromCircle/:userName").get(authenticateUser,getAllPaymentsFromCircle);
router.route("/getPaymentInfoFromCircle/:userName/:paymentId").get(authenticateUser,getPaymentInfoFromCircle);

router.route("/update-activity").put(authenticateUser,updateActivity);
module.exports = router;
