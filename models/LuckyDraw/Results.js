const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
        luckyDrawId: {
            type:String
        },
        userId: {
            type:String
        },
        walletAddress: {
            type:String
        },
        ticketId: {
            type:String,
            unique:true
        },
        prizeToken: {
            type: String,
            unique: true
        }
    },
    { timestamps: true });

module.exports = mongoose.model("LD_Result", ResultSchema);