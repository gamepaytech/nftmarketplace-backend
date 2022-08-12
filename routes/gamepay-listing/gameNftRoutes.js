const express = require('express');

const router = express.Router();
const { getGameList , getGameDetail} = require('../../controller/gamepay-listing/gameNtfController');

router.get('/',getGameList);
router.get('/getGameDetail/:gameId',getGameDetail);

module.exports = router;
