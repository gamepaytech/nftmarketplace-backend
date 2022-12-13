const express = require('express');
const cors = require('cors');

const { addQuest, getQuests, addUserQuest } = require('../controller/questsController');
const { authenticateUser } = require('../middleware/authentication')

const router = express.Router();
router.post('/add', addQuest);
router.post('/view', getQuests);
router.post('/claim', cors(),authenticateUser,addUserQuest);
module.exports = router;