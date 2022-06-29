const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SystemMessagesSchema = new Schema(
    {
        language: { type: String, required: true },
        msg_code: { type: String, required: true },
        message: { type: String, required: true },
        module: { type: String, required: true }
    },
    { timestamps: true }
)

const SystemMessages = mongoose.model('SystemMessages', SystemMessagesSchema)

module.exports = SystemMessages
