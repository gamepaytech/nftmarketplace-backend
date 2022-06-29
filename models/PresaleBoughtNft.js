const mongoose = require("mongoose");

const PresaleBoughtNftSchema = new mongoose.Schema(
    {
        owner: {
            type: String,
            ref: "User",
        },
        nftIdOwned: {
            type: mongoose.Schema.ObjectId,
            ref:"User",
        },
        prevOwner:{
            type:String,
            ref:"User"
        },
        prevOwnerId:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        },
        nft: {
            type: mongoose.Schema.ObjectId,
            ref: "nftDetails",
            required:true
        },
        amountSpent: {
            type: Number,
        },
        promoCode: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1
        },
        currency:{
            type:String,
            default:"USD"
        },
        paymentId: {
            type:String
        },
        paymentMode: {
            type:String
        },
        active:{
            type:Boolean,
            default:true
        }
    },
    { timestamps: true,
        strictPopulate:false }

);

module.exports = mongoose.model("PresaleBoughtNft", PresaleBoughtNftSchema);
