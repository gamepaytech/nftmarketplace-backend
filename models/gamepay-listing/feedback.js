const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
           },
        feedback: {
            type: String,
            required: true,
          },
        comments:{
            type: String,
            required: true,
        },
        imageupload:{
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("feedback", feedbackSchema);