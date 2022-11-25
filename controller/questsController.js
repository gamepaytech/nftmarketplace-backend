const Quest = require('../models/quest')
const logger = require('../logger');

const addQuest = async (req, res) => {
    try {

        const keys = ["questCategory", "gameName", "gameLogo", "questImage", "backgroundImage", "questTitle",
            "questDesc", "questFrequency", "eligiblePoints", "questStartDate", "questEndDate", "questStatus", "actionUrl"];
        for (i in keys) {
            if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
                res.json({ status: 400, msg: keys[i] + " are required" });
                return;
            }
        }
        const {
            questCategory, gameName, gameLogo, questImage, backgroundImage,
            questTitle, questDesc, questFrequency, eligiblePoints, questStartDate, questEndDate,
            questStatus, actionUrl
        } = req.body

        const addData = new Quest({
            questCategory, gameName, gameLogo, questImage, backgroundImage,
            questTitle, questDesc, questFrequency, eligiblePoints, questStartDate, questEndDate,
            questStatus, actionUrl
        });

        const data = await addData.save();
        return res.status(201).json({
            status: "200",
            msg: "Quest added successfully.",
            data: data,
        });

    } catch (error) {
        logger.error(" Error occured - " + error)
        res.status(500).json("Error occured while adding quest");
    }
};


const getQuests = async (req, res) => {
    try {
    
        const total = await Quest.find().count({});
        const data = await Quest.find();
        return res.status(200).json({
            data: data,
            total: total,
            msg: "Quests fetched successfully."
        });
    }
    catch (err) {
        logger.error(err)
        res.status(500).json("Unable to fetch quests.")
    }
};

module.exports = { addQuest, getQuests }