const express = require('express');

const router = express.Router();
const { game } = require('../../controller/gamepay-listing/gameController');

router.post('/',game);

module.exports = router;
