const mongoose = require('mongoose')

const launchpadPaymentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        amountCommited: {
            type: Number,
            required: true,
        },
        paymentMethod:{
            type: String,
            required: true
        },
        paymentStatus: {
          type: String,
        },
        paymentId: {
          type:String,
        },
        metadata : {
          type:String
        }

    },
    { timestamps: true }
)

module.exports = mongoose.model("launchpadPayment", launchpadPaymentSchema);