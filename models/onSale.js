const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    sellerId:{
        type: mongoose.Schema.ObjectId,
        ref:"User"
    },
    nftId:{
        type:mongoose.Schema.ObjectId,
        ref: "presalenfts",
    },
    price:{type:Number},
    currency:{
        type:String,
        default:"USD"
    },
    quantity:{
        type:Number,
        default:1
    },
    itemSold:{
        type:Number
    }

})

module.exports = new mongoose.model("SaleHistory",saleSchema)