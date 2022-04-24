const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PromoCodeSchema = new Schema(
    {
        promoCode: {
          type:String
        },
        validTill: {
          type: String
        },
        totalNumberClaimed: {
          type:Number,
          default:0
        },
        totalNumberCode: {
          type:Number
        },
        percentDiscount: {
          type:Number
        },
        promoCodeStatus: {
          type:Boolean,
          default:true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('PromoCode', PromoCodeSchema)