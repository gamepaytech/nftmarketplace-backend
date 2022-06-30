const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
        luckyDrawId: {
            type:String
        },
        userId: {
            type:String,
        },
        walletAddress: {
            type:String,
        },
        ticketCount: Number,
    },
    { timestamps: true })

module.exports = mongoose.model("LD_Transaction", TransactionSchema);