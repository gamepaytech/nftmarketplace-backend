const mongoose = require("mongoose")
const submitGameSchema = mongoose.Schema(
  {
  // step-1
  email_id:{ type: String, required: true},
  webversion:{type: String, required: true},
  // step-2
  gamestudioname:{type: String, required: true},
  games:{type: String, required: true},
  submitting:{type: String, required: true},
  gamecontent:{type: Boolean},
  username:{type: String, required: true},
  address:{type: String, required: true},
  emailaddress:{type: String},
  // step-3
  gamename:{type: String, required: true},
  gamestatus:{type: String, required: true},
  gamelogo:{type: String, required: true},
  gamemedia:{type: String, required: true},
  gamewebsite:{type: String, required: true},
  gamelaunchdate:{type: String, required: true},
  gamethumbnail:{type: String, required: true},
  gametrailer:{type: String, required: true},
  // // // step-4
  gamedescription:{type: String, required: true},
  blockchains:{type: String},
  gamedetails:{type: String, required: true},
  gametoken:{type: String, required: true},
  coinurl:{type: String, required: true},
  gamegenre:{type: String, required: true},
  platformsgame:{type: String, required: true},
  tokens:{type: String, required: true},
  coingeckourl:{type: String, required: true},
  subredditurl:{type: String, required: true},
  // // // step-5
  twitchurl:{type: String, required: true},
  twitter:{ type: String, required: true},
  partners:{type: String, required: true},
  policyone:{type: String, required: true},
  // // // step-6
  policytwo:{type: String, required: true},
  policythree:{type: String, required: true}

},
{ timestamps: true }
);
module.exports = mongoose.model("submitgame", submitGameSchema);


