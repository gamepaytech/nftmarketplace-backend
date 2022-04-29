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
            ref: "presalenfts",
            required:true
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
    { timestamps: true,
        strictPopulate:false }

);

module.exports = mongoose.model("PresaleBoughtNft", PresaleBoughtNftSchema);
