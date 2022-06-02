const mongoose = require('mongoose')

const circleAPIResponseLog = new mongoose.Schema(
    {
        description: { type: String, required: false },
        email: { type: Number, required: false },
        paymentId: { type: String, required: false },
        paymentStatus: { type: String, required: false },
        respObject: { type: String, required: true },
    },
    { timestamps: true }
)

const circleAPIResponse = mongoose.model('circleAPIResponseLog', circleAPIResponseLog);

module.exports = circleAPIResponse;
