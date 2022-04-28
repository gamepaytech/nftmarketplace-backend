const mongoose = require("mongoose");

const CirclePaymentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    amount : {
      type:String,
    },
    status: {
      type:String,
    },
    nftId: {
      type:String
    },
    paymentId:{
      type:String
    },
    quantity: {
      type:String,
      default:1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CirclePayment", CirclePaymentSchema);