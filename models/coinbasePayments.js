const mongoose = require("mongoose");

const CoinbasePaymentSchema = new mongoose.Schema(
  {
    payId: {
      type: String,
    },
    url : {
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CoinbasePayment", CoinbasePaymentSchema);