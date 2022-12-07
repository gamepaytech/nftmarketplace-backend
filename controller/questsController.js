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

const isQuestClaimed = async (userId, quest) => {
    switch (quest.questFrequency) {
        case "one-time":
            return await checkIfOneTimeQuestIsClaimed(quest._id, userId);
        case "daily":
            return await checkIfDailyQuestIsClaimed(quest._id, userId);
        case "weekly":
            console.log("It is a Tuesday.");
            return await checkIfWeeklyQuestIsClaimed(quest._id, userId);
        case "monthly":
            console.log("It is a Wednesday.");
            return await checkIfMonthlyQuestIsClaimed(quest._id, userId)
        default:
            console.log("No such day exists!");
            return true;
            break;
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
        for (let i = 0; i < quests.length; i++) {
            // console.log(" quests " + quests[i]);
            const questClaimed = await isQuestClaimed(userId, quests[i]);
            console.log("questClaimed -- " + questClaimed);
            if (!questClaimed) {
                userQuests.push(quests[i]);
            }
            console.log("End of iteration -- " + i);
        }
        console.log("-- end of for loop -- ");
        // quests.forEach(async (quest) => {
        //     let removeQuest = false;
        //     console.log("quest.questFrequency  :: " + quest.questFrequency + " id " + quest._id);
        //     switch (quest.questFrequency) {
        //         case "one-time":
        //             removeQuest = await checkIfOneTimeQuestIsClaimed(quest._id, userId);
        //             break;
        //         case "daily":
        //             removeQuest = await checkIfDailyQuestIsClaimed(quest._id, userId);
        //             break;
        //         case "weekly":
        //             console.log("It is a Tuesday.");
        //             break;
        //         case "monthly":
        //             console.log("It is a Wednesday.");
        //             break;
        //         default:
        //             console.log("No such day exists!");
        //             break;
        //     }
        //     if (!removeQuest) {
        //         userQuests.push(quest);
        //     }

        // });

        // groupBy on the userQuests

        return res.status(200).json({
            data: userQuests,
            total: userQuests.length,
            msg: "Quests fetched successfully."
        });
    }
    catch (err) {
        console.log("Error Unable to fetch quests." + err);
        logger.error(err)
        res.status(500).json("Unable to fetch quests.")
    }
};

async function checkIfOneTimeQuestIsClaimed(questId, userId) {
    try {
        const oneTimeQuest = await UserQuest.findOne(
            {
                "userId": userId,
                "transactions.questId": questId
            }
        ).sort({ "transactions.updatedAt": -1 })
            .limit(1);

        if (oneTimeQuest) {
            return true;
        }
        return false;
    } catch (error) {
        logger.error("Error in checkIfOneTimeQuestIsClaimed - " + error);
        return false;
    }
};

async function checkIfDailyQuestIsClaimed(questId, userId) {
    try {
        let getQuest = await UserQuest.findOne(
            {
                "userId": userId,
                "transactions.questId": questId
            }
        );
        if (getQuest) {
            let questTransactions = getQuest.transactions;
            questTransactions = questTransactions.filter(e => {
                return e.questId == questId;
            });
            if (questTransactions && questTransactions.length > 0) {
                questTransactions.sort((a, b) => b.updatedAt - a.updatedAt);
                return new Date(questTransactions[0].updatedAt).toLocaleDateString() === new Date().toLocaleDateString();
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        logger.error("Error occured while checking if daily quest claimed - " + error);
        return false;
    }
};

async function checkIfWeeklyQuestIsClaimed(questId, userId) {
    try {
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        console.log("new Date(new Date(firstDay).setHours(00, 00, 00)) " + new Date(new Date(firstDay).setHours(00, 00, 00)));
        console.log("new Date(new Date(lastDay).setHours(23, 59, 59)) " + new Date(new Date(lastDay).setHours(23, 59, 59)));
        const weeklyQuest = await UserQuest.findOne(
            {
                "userId": userId,
                "transactions.questId": questId,
                "transactions.updatedAt": {
                    $gte: new Date(new Date(firstDay).setHours(00, 00, 00)),
                    $lt: new Date(new Date(lastDay).setHours(23, 59, 59))
                }
            }
        );
        console.log("weeklyQuest -- " + weeklyQuest);
        if (weeklyQuest) {
            console.log("Inside if ");
            return true;
            // let questTransactions = weeklyQuest.transactions;
            // questTransactions = questTransactions.filter(e => {
            //     return e.questId == questId;
            // });
            // if (questTransactions && questTransactions.length > 0) {
            //     questTransactions.sort((a, b) => b.updatedAt - a.updatedAt);

            //     console.log("firstDay   " + firstDay.toLocaleDateString());
            //     console.log("lastDay   " + lastDay.toLocaleDateString());
            //     console.log("new Date(questTransactions[0].updatedAt).toLocaleDateString()   " + new Date(questTransactions[0].updatedAt).toLocaleDateString());
            //     console.log("((new Date(questTransactions[0].updatedAt).toLocaleDateString() >=firstDay.toLocaleDateString()) && (new Date(questTransactions[0].updatedAt).toLocaleDateString() <=lastDay.toLocaleDateString()))  ", ((new Date(questTransactions[0].updatedAt).toLocaleDateString() >= firstDay.toLocaleDateString()) && (new Date(questTransactions[0].updatedAt).toLocaleDateString() <= lastDay.toLocaleDateString())));
            //     return ((new Date(questTransactions[0].updatedAt).toLocaleDate() >= firstDay.toLocaleDate()) && (new Date(questTransactions[0].updatedAt).toLocaleDate() <= lastDay.toLocaleDate()));
            // } else {
            //     return false;
            // }
        } else {
            console.log("Inside else ");
            return false;
        }
    } catch (error) {
        console.log("Error occured while checking if daily weekly quest claimed - " + error);
        logger.error("Error occured while checking if daily weekly quest claimed - " + error);
        return false;
    }
};

async function checkIfMonthlyQuestIsClaimed(questId, userId) {
    const today = new Date();
    //const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    //const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    console.log(firstDay); // 👉️ Sat Oct 01 2022 ...

    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    console.log(lastDay);
    try {
        const monthlyQuest = await UserQuest.findOne(
            {
                "userId": userId,
                "transactions.questId": questId
            }
        );
        if (monthlyQuest) {
            let questTransactions = monthlyQuest.transactions;
            questTransactions = questTransactions.filter(e => {
                return e.questId == questId;
            });
            if (questTransactions && questTransactions.length > 0) {
                questTransactions.sort((a, b) => b.updatedAt - a.updatedAt);
                return (new Date(questTransactions[0].updatedAt) >= firstDay && new Date(questTransactions[0].updatedAt) <= lastDay);
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        logger.error("Error occured while checking if daily weekly quest claimed - " + error);
        return false;
    }
};


// add pagination
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

const getLeaderBoardByPages = async (req, res) => {
    const page = req.params.page || 1;
    const pageSize = req.params.pageSize || 10;
    try {
        const total = await UserQuest.find().count();
        const userQuests = await UserQuest.find()
            .sort({ "totalGPY": -1 })
            .limit(pageSize).skip(pageSize * page);
        const topQuesters = [];
        let rank = pageSize * page;
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
        return res.status(200).json({
            data: topQuesters,
            total: total,
            page: page,
            pageSize: pageSize,
            msg: "Leader board fetched successfully"
        });
    } catch (error) {
        logger.error("Error occured while fetching leader board. ", error);
        res.status(400).json({
            status: "400",
            msg: "Error while fetching leader board data.",
        });
    }
}

const getLeaderBoardBySearchText = async (req, res) => {
    const searchString = req.body.search;

    try {
        const userQuests = await UserQuest.find()
            .sort({ "totalGPY": -1 })
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

        const filteredUsers = topQuesters.filter(e => e.name.toLowerCase().includes(searchString.toLowerCase()));
        //const totalUsers = filteredUsers.length;
        //filteredUsers.splice(0, page * pageSize)

        return res.status(200).json({
            data: filteredUsers,
            total: filteredUsers.length,
            msg: "Leader board by usernames fetched successfully"
        });
    } catch (error) {
        logger.error("Error occured while fetching leader board by user names ", error);
        res.status(400).json({
            status: "400",
            msg: "Error while fetching leader board data.",
        });
    }
}


module.exports = { addQuest, getQuests, addUserQuest, getLeaderBoard, getLeaderBoardByPages, getLeaderBoardBySearchText }
