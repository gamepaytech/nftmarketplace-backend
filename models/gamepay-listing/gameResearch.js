const mongoose = require("mongoose");

const gameResearchSchema = new mongoose.Schema(
  {
    aid: {
      type: String,
      required: true,
    },
    article_title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
      cover: {
        type: String,
        required: true,
      },
      publish_at: { type: String },
      canonical_url: { type: String },
      is_show_exclusive_research_access: { type: String },
      tag: { type: String },
      publisher_id: { type: String },
      publisher: { type: Object },

    
  },
  { timestamps: true }
);

module.exports = mongoose.model("game_researches", gameResearchSchema);
