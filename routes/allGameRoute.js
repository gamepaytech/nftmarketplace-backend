const express = require('express');
const cors = require('cors')

const {  addGames,getGameListingsByType } = require('../controller/gamepay-listing/allGameController');

const router = express.Router();
router.post('/', cors(), addGames);
router.post('/getAllByType', cors(), getGameListingsByType);


module.exports = router;

