const mongoose = require("mongoose");

const PresaleBoughtNftSchema = new mongoose.Schema(
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
);


PresaleBoughtNftSchema.virtual('nfts', {
  ref: 'nftDetails',
  localField: 'nft',
  foreignField: '_id',
  justOne: true // set true for one-to-one relationship
})

// Set Object and Json property to true. Default is set to false
PresaleBoughtNftSchema.set('toObject', { virtuals: true });
PresaleBoughtNftSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("PresaleBoughtNft", PresaleBoughtNftSchema);
