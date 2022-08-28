const mongoose = require("mongoose");
const gameSchema = mongoose.Schema(
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
    coinGeckoUrl: { type: String, required: true },
    coinMarketCapUrl: { type: String, required: true },
    redditUrl: { type: String, required: true },
    redditName: { type: String },
    twitterUrl: { type: String, required: true },
    twitterName: { type: String },
    partnerAuthorised: { type: String },
    twitchUrl: {
      type: String,
      default: "https://www.twitch.tv/thesandboxgame",
    },
    tnCOne: { type: Boolean, required: true }, //TnC refers to TERMS AND CONDITIONS
    tnCTwo: { type: Boolean, required: true },
    tnCThree: { type: Boolean, required: true },
    type:{type:Array},
    approvalStatus: { type: String, default: "pending" },
  },
  { timestamps: true }
);

gameSchema.virtual('reviews', {
  ref: 'games_reviews', //The Model to use
  localField: '_id', //Find in Model, where localField 
  foreignField: 'gameId', // is equal to foreignField
});
// Set Object and Json property to true. Default is set to false
gameSchema.set('toObject', { virtuals: true });
gameSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("games", gameSchema);
