const mongoose = require("mongoose");

const UserQuestSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        totalGPY: {
            type: Number,
            required: true,
            default: 0,
        },
        transactions: [
            {
                type: new mongoose.Schema(
                    {
                        questId : {
                            type : String,
                            required : true
                        },
                    },
                    { timestamps: true }
                )
            }
        ]
    },
    { timestamps: true }
);
module.exports = mongoose.model("user_quests", UserQuestSchema);