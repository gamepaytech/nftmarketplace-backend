const Quest = require('../models/Quest')
const UserQuest = require('../models/UserQuest')
const logger = require('../logger');
const user = require('../models/User');

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
            questTitle, questDesc, questFrequency, eligiblePoints, questStartDate, questEndDate, visibilityType,
            questStatus, actionUrl
        } = req.body

        const addData = new Quest({
            questCategory, gameName, gameLogo, questImage, backgroundImage,
            questTitle, questDesc, questFrequency, eligiblePoints, questStartDate, questEndDate, visibilityType,
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

const addUserQuest = async (req, res) => {
    try {

        const keys = ["userId", "questId", "points"];
        for (i in keys) {
            if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
                res.json({ status: 400, msg: keys[i] + " are required" });
                return;
            }
        }
        const {
            userId, questId, points
        } = req.body

        const transactions = [
            {
                questId: questId
            }
        ]

        const addQuest = new UserQuest({
            userId,
            totalGPY: points,
            transactions: transactions
        });

        const data = await addQuest.save();
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
        const userId = req.body.userId;
        // on button click , check if user is logged In
        const total = await Quest.find({ questStatus: 'Active' }).count({});
        const quests = await Quest.find({ questStatus: 'Active' });

        // traverse through the quests and check if given user id has already claimed the Quest

        // utility method - pass quest referralDetails, user details

        // inisde utility method 

        // step 1 : check if quest frequency is one-time and claimed - if yes, filter out the quest from shopwing to user
        // step 2: check if latest quest frequency is daily and claimed - if claimed today , then filter out the quest from shopwing to user 
        // step 3: check if latest quest frequency is weekly and claimed - if claimed within the current week , then filter out the quest from shopwing to user 
        // step 4: check if latest quest frequency is monthly and claimed - if claimed within the current month , then filter out the quest from shopwing to user 

        console.log("UserId -- " + userId);
        const userQuests = [];
        quests.forEach(async (quest) => {
            let removeQuest = false;
            console.log("quest.questFrequency  :: " + quest.questFrequency + " id " + quest._id);
            switch (quest.questFrequency) {
                case "one-time":
                    removeQuest = await checkIfOneTimeQuestIsClaimed(quest._id, userId);
                    break;
                case "daily":
                    removeQuest = await checkIfDailyQuestIsClaimed(quest._id, userId);
                    break;
                case "weekly":
                    console.log("It is a Tuesday.");
                    break;
                case "monthly":
                    console.log("It is a Wednesday.");
                    break;
                default:
                    console.log("No such day exists!");
                    break;
            }
            if (!removeQuest) {
                userQuests.push(quest);
            }

        });

        // groupBy on the userQuests

        return res.status(200).json({
            data: userQuests,
            total: userQuests.length,
            msg: "Quests fetched successfully."
        });
    }
    catch (err) {
        logger.error(err)
        res.status(500).json("Unable to fetch quests.")
    }
};

async function checkIfOneTimeQuestIsClaimed(questId, userId) {
    try {
        // get questId from user_quests
        const getQuest = await findLatestQuestByUserIdAndQuestId(userId, questId);

        if (getQuest) {
            console.log(" checkIfOneTimeQuestIsClaimed --- " + "Quest claimed");
            return true;
        }
        console.log(" checkIfOneTimeQuestIsClaimed --- " + "Quest not claimed");
        return false;
    } catch (error) {
        console.log("error in checkIfOneTimeQuestIsClaimed" + error);
        logger.error();
        return false;
    }
};

async function checkIfDailyQuestIsClaimed(questId, userId) {
    try {
        // get questId from user_quests
        // const getQuest = await UserQuest.aggregate(
        //     { "userId": userId },
        //     { $unwind: "$transactions" },
        //     { $match: { "transactions.questId": questId } },
        //     { $match: { "transactions.updatedAt": { $eq : new Date()} } },
        //     { $sort: { "transactions.updatedAt": -1 } },
        //     { $limit: 1 },
        //     function (err, result) {
        //         console.log(result);
        //     }
        // );

        const getQuest = await UserQuest.find(
            {
                "userId": userId,
                "transactions.questId": questId,
                "transactions.updatedAt": new Date()
            }
        ).sort({ "transactions.updatedAt": -1 })
            .limit(1);

        console.log("getQuest " + getQuest);
        if (getQuest) {
            console.log("Already claimed!!");
            // get the timestamp of the latest claimed quest and check if the Date(updatedAt) < today's Date

            // if Date(updatedAt) === today's Date{
            //    return true
            // }
            return true;
        }
        console.log("Quest Not claimed!!");
        return false;
    } catch (error) {
        console.log("Quest Not claimed error" + error);
        logger.error();
        return false;
    }
};

async function findLatestQuestByUserIdAndQuestId(userId, questId) {
    // return await UserQuest.aggregate(
    //     { "userId": userId },
    //     { $match: { "transactions.questId": questId } },
    //     { $sort: { "transactions.createdAt": -1 } },
    //     { $limit: 1 },
    //     function (err, result) {
    //         console.log(result);
    //     }
    // );

    const oneTimeQuest = await UserQuest.find(
        { "userId": userId },
        { transactions: { questId: questId } }
    ).sort({ "transactions.updatedAt": -1 })
        .limit(1);

    console.log("oneTimeQuest - " + oneTimeQuest);

    if (oneTimeQuest) {
        console.log("oneTimeQuest claimed ");
        return true;
    }
    console.log("oneTimeQuest not claimed");
    return false;
}

const getLeaderBoard = async (req, res) => {
    const noOfRanks = req.body.noOfRanks;
    try {
        const userQuests = await UserQuest.find()
            .sort({ "totalGPY": -1 })
            .limit(noOfRanks);
        const topQuesters = [];
        let rank = 0;
        for (const quest of userQuests) {
            rank++;
            const userDetails = await user.users.findById(quest.userId);
            if (user) {
                const quester = {
                    name: userDetails.username,
                    rank: rank,
                    userImg: userDetails.profilePic,
                    countryImg: "",
                    countryName: userDetails.country,
                    gpyPoints: quest.totalGPY
                }
                topQuesters.push(quester);
            } else {
                console.log("User details not found - " + quest.userId);
            }
        }
        return res.status(201).json({
            status: "200",
            msg: "Leaderboard data fetched successfully.",
            data: topQuesters,
        });
    } catch (error) {
        logger.error("Error occured while fetching leader board. ", error);
        res.status(400).json({
            status: "400",
            msg: "Error while fetching leader board data.",
        });
    }
}


module.exports = { addQuest, getQuests, addUserQuest, getLeaderBoard }
