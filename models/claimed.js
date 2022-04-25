const mongoose = require('mongoose')
const validator = require('validator')

const claimed = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        wallet:{
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Claimed", claimed);