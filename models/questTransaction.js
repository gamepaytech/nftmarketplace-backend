const mongoose = require("mongoose");

const questsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        transactions: [
            {
                questId: {
                    type: String,
                    required: true,
                }
            },
            { timestamps: true }
        ]
    },
    { timestamps: true }
);
module.exports = mongoose.model("questTransaction", questTransactionsSchema);