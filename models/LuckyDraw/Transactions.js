const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
        luckyDrawId: {
            type:String
        },
        userId: {
            type:String,
            unique:true
        },
        walletAddress: {
            type:String,
            unique:true
        },
        ticketId: {
            type:String,
            unique:true
        },
        ticketCount: Number,
        createdBy: {
            type:String
        }
    },
    { timestamps: true })

module.exports = mongoose.model("LD_Transaction", TransactionSchema);