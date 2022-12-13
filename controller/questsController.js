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
        const keys = ["userId", "questId"];
        for (i in keys) {
            if (req.body[keys[i]] == undefined || req.body[keys[i]] == "") {
                res.json({ status: 400, msg: keys[i] + " are required" });
                return;
            }
        }

        const {
            userId, questId
        } = req.body;

        const userExists = await user.users.findById(userId);
        console.log("find user ", user);
        if (!userExists) {
            return res.json({
                status: 400,
                msg: "User not found"
            });
        }

        const userQuest = await UserQuest.findOne({ "userId": userId });

        console.log("userQuest fetched from db..." + userQuest);

        const quest = await Quest.findById(questId);

        if (userQuest) {
            console.log("User Quest is already present..");

            if (!quest) {
                console.log("Quest is not found!!");
                return res.json({
                    status: 400,
                    msg: "Quest not found!!"
                });
            }
            const questTransactions = userQuest.transactions;
            questTransactions.push({ questId: questId });
            userQuest.transactions = questTransactions;
            userQuest.totalGPY = userQuest.totalGPY + quest.eligiblePoints;

            console.log("userQuest --- ", userQuest);

            const userData = await userQuest.save();

            if (userData) {
                console.log("Quest added successfully..");
                return res.status(201).json({
                    status: "200",
                    msg: "Quest added successfully.",
                    data: userData,
                });
            } else {
                console.log("Error occured while adding quest");
                return res.status(500).json({
                    status: "500",
                    msg: "Error occured while adding user quest."
                });
            }
        } else {
            console.log("oneTimeQuest is not present.. creating one..");

            if (!quest) {
                console.log("Quest is not found!!");
                return res.json({
                    status: 400,
                    msg: "Quest not found!!"
                });
            }

            const transactions = [
                {
                    questId: questId
                }
            ]

            const addQuest = new UserQuest({
                userId,
                totalGPY: quest.eligiblePoints,
                transactions: transactions
            });

            const data = await addQuest.save();
            return res.status(201).json({
                status: "200",
                msg: "Quest added successfully.",
                data: data,
            });
        }
    } catch (error) {
        console.log(" Error occured - ", error)
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
            return await checkIfWeeklyQuestIsClaimed(quest._id, userId);
        case "monthly":
            return await checkIfMonthlyQuestIsClaimed(quest._id, userId)
        default:
            return true;
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
            const questClaimed = await isQuestClaimed(userId, quests[i]);
            console.log("questClaimed -- " + questClaimed);
            if (!questClaimed) {
                userQuests.push(quests[i]);
            }
            console.log("End of iteration -- " + i);
        }
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
                const compareDate = new Date(questTransactions[0].updatedAt);
                return compareDate.toLocaleDateString().toString() === new Date().toLocaleDateString().toString();
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
        const weeklyQuest = await UserQuest.findOne(
            {
                "userId": userId,
                "transactions.questId": questId
            }
        );
        if (weeklyQuest) {
            let questTransactions = weeklyQuest.transactions;
            questTransactions = questTransactions.filter(e => {
                return e.questId == questId;
            });
            if (questTransactions && questTransactions.length > 0) {
                questTransactions.sort((a, b) => b.updatedAt - a.updatedAt);
                const compareDate = new Date(questTransactions[0].updatedAt);
                return (compareDate >= new Date(firstDay) && compareDate <= new Date(lastDay));
            } else {
                return false;
            }
        } else {
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
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
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
                logger.info("User details not found - " + quest.userId);
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
                logger.error("User details not found - " + quest.userId);
            }
        }

        const filteredUsers = topQuesters.filter(e => e.name.toLowerCase().includes(searchString.toLowerCase()));
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
