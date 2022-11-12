const logger = require('../logger')
const models = require('../models/User')
const userSteamInfo = require('../models/steam_info')

const addUserSteamInfo = async (req, res) => {

  const keys = ["userId", "userName", "steamInfo"];
  for (i in keys) {
    if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
      res.json({ status: 400, msg: keys[i] + " is required" });
      return;
    }
  }
  try {
    const userData = await models.users.findById(req.body.userId);
    if (userData) {
      if (userData.username !== req.body.userName) {
        logger.error("Username doen't match with the one in database.");
        res.status(500).json("Input username and Actual username doesn't match.");
      }
      const steamIdFromUrl = getSteamIdFromUrl(req.body.steamInfo);
      const steamInfoDoc = {
        username: userData.username,
        userId: userData._id,
        steamId: steamIdFromUrl,
        rawData: req.body.steamInfo
      }
      const steamObject = await userSteamInfo.create(steamInfoDoc)
      if (steamObject) {
        return res.status(201).json({
          status: "200",
          msg: "Steam id stored in database successfully",
        });
      } else {
        return res.status(500).json({
          status: "500",
          msg: "Error occured while storing steam info.",
        });
      }
    }
    res.status(500).json("Not a valid user.");
  } catch (error) {
    logger.error(error, "Error occured during adding user steam id.");
    res.status(500).json("Error occured during while adding user steam info.");
  }
};

const getSteamIdFromUrl = (steamInfo) => {
  const array = steamInfo.split("?");
  const inputMap = new Map();
  if (array[1]) {
    const keyValues = array[1].split("&");
    for (let i = 0; i < keyValues.length; i++) {
      const keyValue = keyValues[i].split("=");
      inputMap.set(keyValue[0], keyValue[1]);
    }
  }
  inputMap.get("openid.claimed_id");
  const claimed_id = inputMap.get("openid.claimed_id");
  return claimed_id.substring(claimed_id.lastIndexOf("/") + 1);
};

module.exports = { addUserSteamInfo }