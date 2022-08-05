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
    gamePlay: {
      type: Number,
      required: true,
    },
    complexity: {
      type: Number,
      required: true,
    },
    earningPotential: {
      type: Number,
      required: true,
    },
    costEffective: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("games_reviews", reviewSchema);
