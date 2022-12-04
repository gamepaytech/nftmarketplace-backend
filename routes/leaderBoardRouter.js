const express = require('express');
const cors = require('cors');

const { getLeaderBoard, getLeaderBoardByPages } = require('../controller/questsController');

const router = express.Router();
router.post('/leaderBoard', getLeaderBoard);
router.post('/leaderBoard/:page/:pageSize',cors(),getLeaderBoardByPages);

module.exports = router;