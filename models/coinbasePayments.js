const mongoose = require("mongoose");

const CoinbasePaymentSchema = new mongoose.Schema(
  {
    payId: {
      type: String,
    },
    code : {
      type:String,
    },
    amount: {
      type:String,
    },
    currency: {
      type:String
    },
    chickId: {
      type:String
    },
    owner: {
      type:String
    },
    nft: {
      type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoinbasePayment", CoinbasePaymentSchema);