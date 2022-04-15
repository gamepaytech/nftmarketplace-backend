const mongoose = require("mongoose");

const CirclePaymentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    amount : {
      type:String,
      // required: true
    },
    // uuid: {
    //   type:String,
    // },
    status: {
      type:String,
    },
    nftId: {
      type:String
    },
    paymentId:{
      type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CirclePayment", CirclePaymentSchema);