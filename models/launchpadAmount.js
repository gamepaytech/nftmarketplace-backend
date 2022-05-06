const mongoose = require('mongoose')
const validator = require('validator')

const LaunchpadAmountSchema = new mongoose.Schema(
    {
        amountCommited: {
          type:Number
        },
        userId: {
          type:String,
          unique:true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("LaunchpadAmount", LaunchpadAmountSchema);