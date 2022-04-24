const mongoose = require("mongoose");

const PresaleBoughtNftSchema = new mongoose.Schema(
    {
        owner: {
            type: String,
            ref: "User",
        },
        nftIdOwned: {
            type: String,
            required: true,
        },
        nft: { 
          type: mongoose.Types.ObjectId, 
          ref: "Nft" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PresaleBoughtNft", PresaleBoughtNftSchema);