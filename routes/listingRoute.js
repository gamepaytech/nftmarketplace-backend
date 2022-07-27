const express = require('express');
const cors = require('cors');

const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { getGamepayListings } = require('../controller/gamepay-listing/listingController');

router.post('/',cors(),getGamepayListings);

module.exports = router;
