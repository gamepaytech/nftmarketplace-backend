const express = require('express');
const cors = require('cors');

const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {saveLuckyDrawTickets} = require("../controller/luckyDrawController");

router.post('/',cors(),authenticateUser,saveLuckyDrawTickets);

module.exports = router;
