const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const gameReviewSchema = new mongoose.Schema(
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
    opinions:[
      {
        userId:String, 
        isReviewHelpful:Boolean,
        _id:false
      },
      { timestamps: true }
    ]
  },
  { timestamps: true }
);

gameReviewSchema.virtual('userDetail', {
  ref: 'users', //The Model to use
  localField: 'userId', //Find in Model, where localField 
  foreignField: '_id', // is equal to foreignField
});
// Set Object and Json property to true. Default is set to false
gameReviewSchema.set('toObject', { virtuals: true });
gameReviewSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("games_reviews", gameReviewSchema);
