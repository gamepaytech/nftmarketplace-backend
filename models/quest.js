const mongoose = require("mongoose");

/*

    Game Name 
    Game Logo 
    Quest Image
    Quest Title
    Quest Desc
Quest Details - what details? - action url
    Earning Points
    Scheduled Date 
    quest info (daily,weekly,one-time) -= frequency
    Game filters like Active , Claimed , Ended - needed in seperate coleection - quest status
Join in the Quest - questCompleted - not needed
                Total Quests 
                Total Gpy Points a person earned
                Completed Achievements
*/


const questsSchema = new mongoose.Schema(
    {
        questCategory: {
            type: String,
            required: true,
        },
        gameName: {
            type: String,
            required: true,
        },
        gameLogo: {
            type: String,
            required: true,
        },
        questImage: {
            type: String,
            required: true,
        },
        backgroundImage: {
            type: String,
            required: true,
        },
        questTitle: {
            type: String,
            required: true,
        },
        questDesc: {
            type: String,
            required: true,
        },
        questFrequency: {
            type: String,
            required: true,
        },
        eligiblePoints: {
            type: Number,
            required: true,
        },
        questStartDate: {
            type: Date,
            required: true,
        },
        questEndDate: {
            type: Date,
            required: true,
        },
        questStatus: {
            type: String,
            required: true
        },
        actionUrl:{
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model("quest", questsSchema);