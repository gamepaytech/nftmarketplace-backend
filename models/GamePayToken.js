const mongoose = require("mongoose");

const GamePayTokensSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address : {
      type:String,
      required: true
    },
    url: {
      type:String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GamePayToken", GamePayTokensSchema);