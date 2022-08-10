const express = require('express');
const cors = require('cors')

const {  addGames,getGameListings } = require('../controller/gamepay-listing/allGameController');

const router = express.Router();
router.post('/', cors(), addGames);
router.post('/getAll', cors(), getGameListings);

module.exports = router;

