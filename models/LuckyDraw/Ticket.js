const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
        luckyDrawId: {
            type:String
        },
        userId: {
            type:String
        },
        walletAddress: {
            type:String
        },
        createdBy: {
            type:String
        }
    },
    { timestamps: true })

module.exports = mongoose.model("LD_Ticket", TicketSchema);