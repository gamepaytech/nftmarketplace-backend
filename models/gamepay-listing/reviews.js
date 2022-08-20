const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    gameId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    funToPlay: {
      type: Number,
      required: true,
    },
    abilityToEarn: {
      type: Number,
      required: true,
    },
    affordability: {
      type: Number,
      required: true,
    },
    easyToLearn: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("games_reviews", reviewSchema);
