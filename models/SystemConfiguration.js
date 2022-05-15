const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SystemConfigurationSchema = new Schema(
    {
        config_name: { type: String, required: true }, 
        config_value: { type: String, required: true },
        description: { type: String, required: false },
        module: { type: String, required: true }
    },
    { timestamps: true }
)

module.exports = mongoose.model('SystemConfiguration', SystemConfigurationSchema)
