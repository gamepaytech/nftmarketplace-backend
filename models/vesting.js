const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VestingSchema = new Schema(
    {
        wallet_address: { type: String, required: true },
        token: { 
          type: Object, 
          amount_invested: { type:String},
          allotted_qty: { type:String},
          unit_price: { type:String},
          unit_currency: { type:String}
        },
        nft:{
          type:Object,
          amount_invested: { type:String},
          allotted_qty: { type:String},
          unit_price: { type:String},
          unit_currency: { type:String}

        }
        
    },
    { timestamps: true }
)

module.exports = mongoose.model('Vesting', VestingSchema)
