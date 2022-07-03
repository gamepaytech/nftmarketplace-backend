const express = require('express');
const cors = require('cors');

const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {saveLuckyDrawTickets} = require("../controller/luckyDrawController");
const {getMyEntries}= require("../controller/luckyDrawController");
const {saveLuckyDrawConfig}=require('../controller/luckyDrawConfigController');
const {getTotalEntries}=require('../controller/luckyDrawController');

router.post('/',cors(),saveLuckyDrawTickets);
router.get('/',cors(),getMyEntries);
router.get('/total-entries',cors(),getTotalEntries);
router.post('/price-contest',cors(),saveLuckyDrawConfig);

module.exports = router;
