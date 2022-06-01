const mongoose = require('mongoose')

const preSaleNftsInitiated = new mongoose.Schema(
    {
        nftId: { type: String, required: true },
        nftCount: { type: Number, required: true },
        userId: { type: String, required: true },
        promoApplied: { type: String, required: true },
        email: { type: String, required: true },
        paymentId: { type: String, required: true },
        paymentStatus: { type: String, required: true },
    },
    { timestamps: true }
)

const preSaleNftInitiated = mongoose.model('preSaleNftsInitiated', preSaleNftsInitiated);

module.exports = preSaleNftInitiated;
