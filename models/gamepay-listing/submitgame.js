const mongoose = require("mongoose");
const submitGameSchema = mongoose.Schema(
  {
    emailId: { type: String, required: true, unique: true },
    webVersion: { type: String, required: true },
    userName: { type: String, required: true },
    gameStudioName: { type: String, required: true },
    relatedGame: { type: String, required: true },
    gameContent: { type: Boolean, default: "false" },
    emailAddress: { type: String },
    address: { type: String, required: true },
    designation: { type: String, required: true },
    gameName: { type: String, required: true, unique: true },
    gameStatus: { type: String, required: true },
    logo: { type: String, required: true },
    media: { type: Array },
    thumbnail: { type: String, required: true },
    thumbnailWithFrame: { type: String, default: "" },
    launchDate: { type: String, required: true },
    website: { type: String, required: true },
    trailer: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    tokenEarnings: { type: String, required: true },
    genre: { type: Array },
    platforms: { type: String, required: true },
    blockChains: { type: Array },
    tokenContract: { type: String, required: true },
    coinGeckoUrl: { type: String},
    coinMarketCapUrl: { type: String, required: true },
    redditUrl: { type: String, required: true },
    redditName: { type: String },
    twitterUrl: { type: String, required: true },
    twitterName: { type: String },
    partnerAuthorised: { type: String },
    twitchUrl: {type: String},
    tnCOne: { type: Boolean, required: true }, //TnC refers to TERMS AND CONDITIONS
    tnCTwo: { type: Boolean, required: true },
    tnCThree: { type: Boolean, required: true },
    type:{type:Array},
    gameMetrics:{type:String},
    approvalStatus: { type: String, default: "pending" },
  },
  { timestamps: true }
);


module.exports = mongoose.model("submitgame", submitGameSchema);