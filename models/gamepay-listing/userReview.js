const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    gameId: {
      type:String,
      required: true,
    },
    reviewId: {
      type:String,
      required: true,
      ref : 'games_reviews'
    },
    isReviewHelpful: {
      type:Boolean
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("userReview", userReviewSchema);