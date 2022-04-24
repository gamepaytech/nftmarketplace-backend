const mongoose = require('mongoose')
const Schema = mongoose.Schema

const presaletierSchema = new Schema(
    {
        tier_type: { type: String, required: true },
        quantity: { type: String, required: true },
        price: { type: String, required: true },
        duration_in_days: { type: String, required: true },
        soldCount: { type: String},
        start_date: { type: String},
        end_date: { type: String },
    },
    { timestamps: true }
)


module.exports = {
    presaletiers: mongoose.model('presaletiers', presaletierSchema),
}
