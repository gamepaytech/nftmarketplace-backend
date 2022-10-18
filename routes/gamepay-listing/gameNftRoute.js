const express = require('express');
const cors = require('cors');
const { getGameNFTList, insertORUpdateGameNFTList } = require('../../controller/gamepay-listing/gameNFTController');

const router = express.Router();

router.get('/:page/:limit', cors(),getGameNFTList); 
router.get('/insertOrUpdate', cors(),insertORUpdateGameNFTList); 


module.exports = router;
