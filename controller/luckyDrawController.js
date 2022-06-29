const logger = require('../logger');
const Ticket = require("../models/LuckyDraw/Ticket");
const Result = require("../models/LuckyDraw/Results");

const saveLuckyDrawTickets = async (req, res) => {
    try {
        const {userId, luckyDrawId, ticketCount, walletAddress} = req.body;

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

        await Ticket.insertMany(tickets).then(
            res.status(200).json({
                data: "Saved Successfully"
            })
        ).catch(err => {
            res.status(500).json({
                err: err,
            });
        });
    } catch (err) {
        logger.info(err);
        res.status(500).json({
            err: "Internal server error!",
        });
    }
};

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
    saveLuckyDrawTickets
}
