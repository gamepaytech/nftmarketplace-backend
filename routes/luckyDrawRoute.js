const express = require('express');
const cors = require('cors');

const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {saveLuckyDrawTickets} = require("../controller/luckyDrawController");
const {getMyEntries}= require("../controller/luckyDrawController");
const {saveLuckyDrawConfig}=require('../controller/luckyDrawConfigController');
const {getTotalEntries}=require('../controller/luckyDrawController');
router.post('/',cors(), authenticateUser, saveLuckyDrawTickets);
router.post('/user-entries',cors(), authenticateUser, getMyEntries);
router.post('/total-entries',cors(), authenticateUser, getTotalEntries);
router.post('/price-contest',cors(), authenticateUser, saveLuckyDrawConfig);

module.exports = router;
