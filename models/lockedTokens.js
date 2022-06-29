const mongoose = require('mongoose')
const validator = require('validator')

const LockedTokenSchema = new mongoose.Schema(
    {
        cliff_period: {
            type: Date,
            required: true,
        },
        tokenName: {
            type: String,
            required: true,
        },
        vesting_duration_in_months:{
            type: String,
            required: true
        },
        wallet_address:{
          type:String,
          required:true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("LockedToken", LockedTokenSchema);