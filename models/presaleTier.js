const mongoose = require('mongoose')
const Schema = mongoose.Schema

const presaletierSchema = new Schema(
    {
        tier_type: { type: String, required: true },
        quantity: { type: String, required: true },
        price: { type: String, default: true },
        duration_in_days: { type: String, default: true },
    },
    { timestamps: true }
)


module.exports = {
    presaletiers: mongoose.model('presaletiers', presaletierSchema),
}
