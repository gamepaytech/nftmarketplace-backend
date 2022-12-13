const express = require('express');

const { addQuest, getQuests, addUserQuest } = require('../controller/questsController');

const router = express.Router();
router.post('/add', addQuest);
router.post('/view', getQuests);
router.post('/claim', addUserQuest);
module.exports = router;