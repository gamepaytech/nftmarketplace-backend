const express = require('express');
const cors = require('cors')

const router = express.Router();
const { getGameList , getGameDetail,getAllGameDetails,getApprovalStatus} = require('../../controller/gamepay-listing/gameNtfController');

router.get('/gameList', cors(),getGameList);
router.get('/getGameDetail/:gameId', cors(),getGameDetail);
router.get('/allgames', cors(),getAllGameDetails);
router.put('/admin', cors(),getApprovalStatus);

module.exports = router;
