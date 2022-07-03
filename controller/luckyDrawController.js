const logger = require('../logger');
const Ticket = require("../models/LuckyDraw/Ticket");
const Result = require("../models/LuckyDraw/Results");
const LdTransaction = require("../models/LuckyDraw/Transactions");
const e = require('express');

const saveLuckyDrawTickets = async (req, res) => {
    try {
        const { userId, luckyDrawId, ticketCount, walletAddress } = req.body;
        if (ticketCount && ticketCount > 0) {
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
            if (ticketDbResponse) {
                const transaction = await LdTransaction.create({ userId, luckyDrawId, ticketCount, walletAddress })
                if (transaction) {
                    res.status(200).json({
                        data: "Saved Successfully"
                    })
                } else {
                    res.status(500).json({
                        err: err,
                    });
                }

            } else {
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
    const { luckyDrawId, userId } = req.body;
    try {
        logger.info("Start of getMyEntries");

        if (!!luckyDrawId && !!userId) {
            logger.info("Getting tickets count from database");
            const myEntries = await LdTransaction.aggregate([
                { $match: { userId, luckyDrawId } },
                { $group: { _id: null, ticketCount: { $sum: { "$toInt": "$ticketCount" } } } }
            ]);
            const totalCount = myEntries.length > 0 ? myEntries[0].ticketCount : 0;
            logger.info("Total tickets :: " + totalCount);
            return res.status(200).json({
                data: totalCount,
                message: "Data Fetched Successfully"
            })
        } else {
            logger.info("LuckyuDraw Id and Userid are required");
            res.status(400).json({ status: "error", msg: "LuckyuDraw Id and Userid are required" });
            return;
        }
    } catch (err) {
        logger.error(`An error occured while fetching ticket count for user id ${userId} for the luckydraw id ${luckyDrawId}` + err);
        res.status(500).json({
            err: err,
            message: "An error occured while fetching ticket count for user"
        });
    }
}

const getTotalEntries = async (req, res) => {
    try {
        logger.info("Start of getMyEntries");
        const { luckyDrawId } = req.body;

        if (luckyDrawId === null || luckyDrawId === "") {
            logger.info(luckyDrawId + "cannot be of empty.");
            res
                .status(400)
                .json({ status: "error", msg: "LuckyDrawId is required" });
            return
        }

        const myEntries = await LdTransaction.aggregate([
            { $match: { luckyDrawId: luckyDrawId } },
            { $group: { _id: null, ticketCount: { $sum: { "$toInt": "$ticketCount" } } } }
        ]);
        if (myEntries) {
            const totalCount = myEntries.length > 0 ? myEntries[0].ticketCount : 0;
            logger.info("Total ticket count :: " + totalCount);
            //const LuckyDrawEntries = await LdTransaction.find({ $and: [{ luckyDrawId: req.body.luckyDrawId }] })
            return res.status(200).json({
                data: totalCount,
                message: "Data Fetched Successfully"
            })
        } else {
            logger.error("Error occured while getting ticket count from database.");
            res
                .status(400)
                .json({ status: "error", msg: "Error getting tickets from database" });
            return
        }
    } catch (err) {
        logger.error("Error While Getting Total Entries For The Specific ID" + err);
        res.status(500).json({
            err: err,
            message: "Something Went Wrong"
        });
    }
}
const getLuckyDrawResults = async (req, res) => {
    try {
        const luckyDrawResults = await Result.aggregate({
            $group: { _id: '$date', tickeId: { $push: '$tickeId' } }
        },
            {
                $project: {
                    date: '$_id', tickeId: 1, _id: 0
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
