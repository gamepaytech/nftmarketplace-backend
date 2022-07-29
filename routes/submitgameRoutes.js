const express = require('express');

const router = express.Router();
const { game } = require('../controller/submit-game/submitgameController');

router.post('/',game);

module.exports = router;
