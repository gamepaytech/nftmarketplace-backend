const express = require('express');
const cors = require('cors')
const { addUserSteamInfo } = require('../controller/userSteamInfoController');
const { authenticateUser } = require('../middleware/authentication');

const router = express.Router();
router.post('/userSteamInfo', cors(), authenticateUser, addUserSteamInfo);


module.exports = router;