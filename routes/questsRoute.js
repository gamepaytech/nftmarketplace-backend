const express = require('express');

const { addQuest,getQuests } = require('../controller/questsController');

const router = express.Router();
router.post('/add', addQuest);
router.get('/view/:page/:pageSize', getQuests);

module.exports = router;