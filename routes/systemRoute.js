const express = require('express');
const {
    getSysMessage,
    getSysMessageByLang,
    getSysConfig,
    getFeatureAccessController,
    getBaseCommission
} = require('../controller/systemController');
const cors = require('cors')

const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

router.get('/getSystemMessage/:msgCode',cors(),authenticateUser,getSysMessage);
router.get('/getSystemMessageByLang/:msgCode/:language',cors(),authenticateUser,getSysMessageByLang);
router.get('/getSystemConfig/:config',cors(),authenticateUser,getSysConfig);
router.get('/getFeatureControl/:featureName/:userEmail', cors(),authenticateUser, getFeatureAccessController)
router.get('/getBaseCommission/:userEmail', cors(),authenticateUser, getBaseCommission)

module.exports = router;
