const mongoose = require("mongoose")
const gameSchema = mongoose.Schema(
  {
  emailId:{ type: String, required: true},
  webVersion:{type: String, required: true},
  userName:{type: String, required: true},
  gameStudioName:{type: String, required: true},
  relatedGame:{type: String, required: true},
  gameContent:{type: Boolean},
  emailAddress:{type: String},
  address:{type: String, required: true},
  designation:{type:String,requried:true},
  gameName:{type: String, unique:true},
  statusGame:{type: String, required: true},
  gameLogo:{type: String, required: true},
  gameMedia:{type: String, required: true},
  gameThumbnail:{type: String, required: true},
  gameLaunchDate:{type: String, required: true},
  gameWebsite:{type: String, required: true},
  gameTrailer:{type: String, required: true},
  gameDescription:{type: String, required: true},
  gamePrice:{type: Number, required: true},
  tokenEarnings:{type: Number, required: true},
  gameGenre:{type: String, required: true},
  platFormsGame:{type: String, required: true},
  blockChains:{type: String},
  tokenContracts:{type: String, required: true},
  coinGeckoUrl:{type: String, required: true},
  coinMarketCapUrl:{type: String, required: true},
  subredditUrl:{type: String, required: true},
  twitter:{ type: String, required: true},
  partnersAuthorised:{type: String, required: true},
  twitchUrl:{type: String, required: true},
  policyOne:{type: String, required: true},
  policyTwo:{type: String, required: true},
  policyThree:{type: String, required: true}

},
{ timestamps: true }
);
module.exports = mongoose.model("game", gameSchema);


