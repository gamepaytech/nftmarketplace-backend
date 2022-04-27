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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Nft"
        },
        amountSpent: {
            type: Number,
            required: true,
        },
        promoCode: {
            type: String,
        },
        quantity: {
            type: String,
            default: 1
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("PresaleBoughtNft", PresaleBoughtNftSchema);
