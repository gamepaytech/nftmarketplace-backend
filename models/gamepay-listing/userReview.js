const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userReviewSchema = new mongoose.Schema(
  {
    reviewerId: {
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
    comment: {
      type: String,
      required: true,
    },
    opinions:[
      {
        userId:String, 
        isReviewHelpful:Boolean,
        _id:false
      },
      { timestamps: true }

    ]
  },
);

module.exports = mongoose.model("userReview", userReviewSchema);