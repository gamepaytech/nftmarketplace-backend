const express = require("express");
const {
    getSysMessage,
    getSysMessageByLang,
    getSysConfig
} = require("../controller/systemController");

const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

router.route("/getSystemMessage").get(authenticateUser,getSysMessage);
router.route("/getSystemMessageByLang").get(authenticateUser,getSysMessageByLang);
router.route("/getSystemConfig").get(authenticateUser,getSysConfig);

module.exports = router;
