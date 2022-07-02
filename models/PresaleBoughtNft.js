const mongoose = require("mongoose");

const PresaleBoughtNftSchema = new mongoose.Schema(
<<<<<<< HEAD
  {
    owner: {
      type: String,
      ref: "User",
    },
    nftIdOwned: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    prevOwner: {
      type: String,
      ref: "User",
    },
    prevOwnerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    nft: {
      type: mongoose.Schema.ObjectId,
      ref: "nftDetails",
      required: true,
    },
    amountSpent: {
      type: Number,
    },
    promoCode: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentId: {
      type: String,
    },
    paymentMode: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    saleId: {
      type: Number,
    },
  },
  { timestamps: true, strictPopulate: false }
=======
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
        },
        promoCode: {
            type: String,
        },
        quantity: {
            type: String,
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
        metamaskKey: {
            type:String,
            default:""
        }
    },
    { timestamps: true,
        strictPopulate:false }

>>>>>>> afe16818e43c7124559bce882ab5291f48fe7fbf
);

module.exports = mongoose.model("PresaleBoughtNft", PresaleBoughtNftSchema);
