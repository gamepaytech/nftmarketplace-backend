const express = require('express');
const cors = require('cors');

const { addQuest, getQuests, addUserQuest, getGPYPoints } = require('../controller/questsController');
const { authenticateUser } = require('../middleware/authentication')

const router = express.Router();
router.post('/add', addQuest);
router.post('/view', getQuests);
router.post('/claim', cors(),authenticateUser,addUserQuest);
router.post('/getGPYPoints', cors(),authenticateUser,getGPYPoints);
module.exports = router;