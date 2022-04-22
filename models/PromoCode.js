const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PromoCodeSchema = new Schema(
    {
        promoCode: {
          type:String,
          required:true
        },
        validTill: {
          type: Date,
          required:true
        },
        totalNumberClaimed: {
          type:Number
        },
        totalNumberCode: {
          type:Number
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('PromoCode', PromoCodeSchema)