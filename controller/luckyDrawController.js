const logger = require('../logger');
const Ticket = require("../models/LuckyDraw/Ticket");
const Result = require("../models/LuckyDraw/Results");
const LdTransaction = require("../models/LuckyDraw/Transactions");
const e = require('express');

const saveLuckyDrawTickets = async (req, res) => {
    try {
        const {userId, luckyDrawId, ticketCount, walletAddress} = req.body;
       if(ticketCount && ticketCount>0){
        const tickets = [];
        for (let i = 0; i < ticketCount; i++) {
            const ticket = {
                userId,
                luckyDrawId,
                walletAddress
            }
            tickets.push(ticket);
            logger.info(`${ticket} , tickets: ${tickets}`);
        }
        
        const ticketDbResponse = await Ticket.insertMany(tickets);
        if(ticketDbResponse){
            const transaction = await LdTransaction.create({userId, luckyDrawId, ticketCount, walletAddress})
             if(transaction){
                res.status(200).json({
                            data: "Saved Successfully"
                        })
             } else{
                res.status(500).json({
                            err: err,
                        });
             }
            
        } else{
            res.status(500).json({
                        err: "Error occured while saving tickets",
                    });
        }
       } else {
        res.status(400).json({
            err: "Ticket Count cannot be empty",
        });
       }
        
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};
const getMyEntries = async (req, res) => {


    // const { luckyDrawId, userId } = req.body;
    try {
        const keys = ["luckyDrawId", "userId"]
        for (i in keys) {
            if (!req.body.i) {
                res
                    .status(400)
                    .json({ status: "error", msg: keys[i] + " are required" });
                    return;
            }
        }
        const myEntries = await LdTransaction.aggregate([
            { $match: { userId,luckyDrawId} },
            { $group: { _id : null, ticketCount: { $sum: { "$toInt": "$ticketCount" } } } }
          ]);
          const totalCount = myEntries.length > 0 ? myEntries[0].ticketCount : 0;
        const LuckyDrawEntries = await LdTransaction.find({ $and: [{ luckyDrawId: req.body.luckyDrawId }, { userId: req.body.userId }] })
        return res.status(200).json({
            data: totalCount,
            message: "Data Fetched Successfully"
        })
    } catch (err) {
        res.status(500).json({
            err: err,
            message: "Something Went Wrong"
        });
    }
}

const getTotalEntries = async (req, res) => {

    try {
        const keys = ["luckyDrawId"]
        for (i in keys) {
            if (req.body.i === null || req.body.i === "" ) {
                res
                    .status(400)
                    .json({ status: "error", msg: keys[i] + " is required" });
                    return
            }
        }
        const myEntries = await LdTransaction.aggregate([
            { $match: { luckyDrawId} },
            { $group: { _id : null, ticketCount: { $sum: { "$toInt": "$ticketCount" } } } }
          ]);
          const totalCount = myEntries.length > 0 ? myEntries[0].ticketCount : 0;
        const LuckyDrawEntries = await LdTransaction.find({ $and: [{ luckyDrawId: req.body.luckyDrawId }] })
        return res.status(200).json({
            data: totalCount,
            message: "Data Fetched Successfully"
        })
    } catch (err) {
        logger.error(err,"Error While Getting Total Entries For The Specific ID");
        res.status(500).json({
            err: err,
            message: "Something Went Wrong"
        });
    }
}
const getLuckyDrawResults = async (req, res) => {
    try {
        const luckyDrawResults = await Result.aggregate({
            $group: {_id: '$date', patients: {$push: '$patient'}}
        },
            {
            $project: {date: '$_id', patients: 1, _id: 0
            }
        });
        res.status(200).json({ data: luckyDrawResults });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};

module.exports = {
    saveLuckyDrawTickets,
    getMyEntries,
    getTotalEntries
}
