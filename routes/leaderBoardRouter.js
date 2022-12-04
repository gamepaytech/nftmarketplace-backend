const express = require('express');

const { getLeaderBoard } = require('../controller/questsController');

const router = express.Router();
router.post('/leaderBoard', getLeaderBoard);

module.exports = router;