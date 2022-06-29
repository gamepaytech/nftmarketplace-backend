const mongoose = require("mongoose");

const TripleaPaymentSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
    },
    type : {
      type:String,
    },
    payment_reference: {
      type:String,
    },
    crypto_currency: {
      type:String
    },
    crypto_address:{
      type:String
    },
    crypto_amount: {
      type:String,
    },
    order_currency: {
      type:String,
    },
    order_amount: {
      type:String,
    },
    exchange_rate: {
      type:String,
    },
    status: {
      type:String,
    },
    status_date: {
      type:String,
    },
    receive_amount: {
      type:String,
    },
    payment_tier: {
      type:String,
    },
    payment_currency: {
      type:String,
    },
    payment_amount: {
      type:String,
    },
    payment_crypto_amount: {
      type:String,
    },
    orderId: {
      type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TripleaPayment", TripleaPaymentSchema);