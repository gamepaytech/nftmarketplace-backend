const mongoose = require("mongoose");

const gamepayListingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    data:{
      type:Array
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("gamepay-listings", gamepayListingSchema);
