const mongoose = require("mongoose");

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
    },
    isReviewHelpful: {
      type:Boolean
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("userReview", userReviewSchema);