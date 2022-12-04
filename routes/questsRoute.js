const express = require('express');

const { addQuest,getQuests } = require('../controller/questsController');

const router = express.Router();
router.post('/add', addQuest);
router.post('/view', getQuests);

module.exports = router;