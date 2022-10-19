const express = require('express');
const cors = require('cors')

const router = express.Router();
const { getGameList , getGameDetail,getAllGameDetails,approvalStatus} = require('../../controller/gamepay-listing/gameNtfController');

router.get('/gameList', cors(),getGameList); 
router.get('/getGameDetail/:gameName', cors(),getGameDetail); 
router.get('/allgames', cors(),getAllGameDetails); 
router.put('/admin', cors(),approvalStatus);

module.exports = router;
