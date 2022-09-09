const mongoose = require("mongoose");

const gameResearchSchema = new mongoose.Schema(
  {
    article_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    cover_img: {
      type: String,
      required: true,
    },
    publish_date: { type: String },
    is_show_exclusive_research_access: { type: String },
    tag: { type: String },
    publisher_id: { type: String },
    publisher: { type: Object },
    details: { type: Object ,default:{}},
  },
  { timestamps: true }
);

module.exports = mongoose.model("game_researches", gameResearchSchema);
