const express = require('express');

const router = express.Router();
const { game } = require('../../controller/gamepay-listing/gameController');
const { authenticateClientIdAndSecret } = require('../../middleware/authentication');

router.post('/',game);
router.post('/game-1', authenticateClientIdAndSecret,(req,res)=>{
    return res.send("call ")
});


module.exports = router;
