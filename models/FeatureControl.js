const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeatureControlSchema = new Schema(
    {
        feature_name: { type: String, required: true }, 
        users_accessible: { type: String, required: true },
        description: { type: String, required: false },
    },
    { timestamps: true }
)

module.exports = mongoose.model('FeatureControl', FeatureControlSchema)
