const mongoose = require('mongoose');

const PrizeChikyType = new mongoose.Schema({
    chickyImg: [String],
    chikyValue: Number
},{ timestamps: true });

const LuckyDrawSchema = new mongoose.Schema({
        type: {
            type:String
        },
        endsOn: {
            type: Date
        },
        prizeChikyType: [PrizeChikyType],
        createdBy: {
            type:String
        }
    },
    { timestamps: true });

module.exports = mongoose.model("LD_Draw", LuckyDrawSchema);