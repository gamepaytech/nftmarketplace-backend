const mongoose = require('mongoose')
const Schema = mongoose.Schema

const launchpadSchema = new Schema(
    {
        type: { type: String, required: true },
        price: { type: String, required: true },
        nft_offer: { type: String, required: true },
        hard_cap: { type: String, required: true },
        subscription_start_date: { type: String},
        calculation_start_date: { type: String},
        final_NFT_distribution_date: { type: String},
    },
    { timestamps: true }
)


module.exports = {
    launchpads: mongoose.model('launchpads', launchpadSchema),
}
