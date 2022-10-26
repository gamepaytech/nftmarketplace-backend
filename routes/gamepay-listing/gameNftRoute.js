const express = require('express');
const cors = require('cors');
const { getGameNFTList, insertORUpdateGameNFTDetails, updateGameNFTList, updateGameTokenDetails } = require('../../controller/gamepay-listing/gameNFTController');

const router = express.Router();

router.get('/list/update', cors(),updateGameNFTList); 
router.get('/token/update', cors(),updateGameTokenDetails); 
router.get('/insertOrUpdate', cors(),insertORUpdateGameNFTDetails); 
router.get('/:page/:limit', cors(),getGameNFTList); 


module.exports = router;
