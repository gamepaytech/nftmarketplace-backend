const mongoose = require("mongoose");

const userSteamInfo = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "username has already taken"],
    },
    userId: {
      type: String,
      required: true,
      unique: [true, "username has already taken"],
    },
    rawData: {
      type: String,
      required: true
    },
    steamId:  {
      type: String,
      required: true,
      unique: [true, "username has already taken"],
    }
  },
  { timestamps: true }
);

module.exports =  mongoose.model("user_steam_info", userSteamInfo);
