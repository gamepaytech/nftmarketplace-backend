const Store = require("../models/Store")
const UserQuest = require('../models/UserQuest')
const user = require('../models/User');
const lodash = require("lodash"); 

const gpyStore = async (req, res) => {
    try {
        const {
            storeCategory,
            storeLogo,
            // storeImage,
            product,
            description,
            startDate,
            endDate,
            storePoints,
        } = req.body

        const store = new Store({
            storeCategory,
            storeLogo,
            // storeImage,
            product,
            description,
            startDate,
            endDate,
            storePoints,
        });

        const data = await store.save();
        return res.status(201).json({
            data: data,
            status: "200",
            msg: "Data Updated Successfully.",
            
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}


const Purchase = async (req, res) => {
    const userId = req.body.userId;
    const userQuest = await UserQuest.findOne({ "userId": userId });
    // console.log(userQuest);
    const data = await Store.findById(req.body.id);
    if (data.storePoints > 0 && data.available < 10)  {
        console.log(data.storePoints)
        userQuest.totalGPY = userQuest.totalGPY - data.storePoints;
        // data.storePoints = userQuest.totalGPY - data.storePoints;
        // userQuest.totalGPY = data.storePoints;
        console.log(userQuest.totalGPY);
        data.available = data.available + 1;
        await data.save();
        await userQuest.save();
        return res.status(200).json({
            data: data,
            msg: "Card Successfully Purchase"
        })
    }
    await data.save();
    return res.status(400).json({
        data: data,
        msg: "Falied to Purchase the Card"
    })
}

const getStore = async (req, res) => {
    try {
        const data = await Store.find();
        let grouped_data = lodash.groupBy(data, 'storeCategory' )
        return res.status(200).json({
            data: grouped_data,
            msg: "Data Get Successfully"
        });
    } catch (error) {
        console.log(error);
        //   logger.error(error)
        res.status(500).json(error)
    }
}

const getStoreId = async (req, res) => {
    try {
        const data = await Store.findById(req.body.id);
        return res.status(200).json({
            data: data,
            msg: "Data Get Successfully"
        });
    } catch (error) {
        console.log(error);
        //   logger.error(error)
        res.status(500).json(error)
    }
}


module.exports = { gpyStore, Purchase, getStore,getStoreId };